import { Request, Response } from "express";
import mongoose from "mongoose";
import PropertyModel from "../model/property";
import {
  createPayPalOrder,
  capturePayPalOrder,
  getPayPalOrder,
} from "../service/paypal";
import { IUserPayload } from "../interface/user";
import pendingBooking from "../model/pendingBooking";
import { ReserveDateModel } from "../model/ReservDates";

export default class PayPalController {
  async createOrder(req: Request, res: Response) {
    try {
      const user = req.user as IUserPayload;
      const { propertyId } = req.body;
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(req.body.endDate);

      const today = new Date();
        today.setHours(0, 0, 0, 0);

        const reservationStart = new Date(startDate);
        reservationStart.setHours(0, 0, 0, 0);

      if (
        !mongoose.isValidObjectId(propertyId) ||
        isNaN(startDate.getTime()) ||
        isNaN(endDate.getTime()) ||
        reservationStart < today ||
        startDate >= endDate
        ) {
        return res.status(400).json({
            status: "error",
            message: "Invalid property or reservation dates",
        });
        }

      const property = await PropertyModel.findById(propertyId);

      if (!property || !property.nightPrice) {
        return res.status(404).json({
          status: "error",
          message: "Property not found or price unavailable",
        });
      }

      // Calculate nights on the server, not in React.
      const nights = Math.round(
        (Date.UTC(
          endDate.getUTCFullYear(),
          endDate.getUTCMonth(),
          endDate.getUTCDate()
        ) -
          Date.UTC(
            startDate.getUTCFullYear(),
            startDate.getUTCMonth(),
            startDate.getUTCDate()
          )) /
          86_400_000
      );

      if (nights <= 0) {
        return res.status(400).json({
          status: "error",
          message: "Invalid reservation duration",
        });
      }

      const amount = Number(
        (nights * Number(property.nightPrice)).toFixed(2)
      );

      if (!Number.isFinite(amount) || amount <= 0) {
        return res.status(400).json({
          status: "error",
          message: "Invalid reservation amount",
        });
      }

      // TODO: Check confirmed bookings and atomically
      // lock every night before creating a PayPal order.

      const pending = await pendingBooking.create({
        userId: user._id,
        propertyId,
        startDate,
        endDate,
        amount,
        currency: "USD",
        status: "pending",
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });

      try {
        const order = await createPayPalOrder(amount);

        pending.paypalOrderId = order.id;
        await pending.save();

        return res.status(201).json({
          status: "success",
          orderId: order.id,
          amount,
          currency: "USD",
        });
      } catch (error) {
        pending.status = "failed";
        await pending.save();
        throw error;
      }
    } catch (error) {
      console.error("Create PayPal order failed:", error);

      return res.status(500).json({
        status: "error",
        message: "Unable to create payment",
      });
    }
  }

  async captureOrder(req: Request, res: Response) {
  try {
    const user = req.user as IUserPayload;
    const { orderId } = req.body;

    if (!orderId || typeof orderId !== "string") {
      return res.status(400).json({
        status: "error",
        message: "PayPal order ID is required",
      });
    }

    const pending = await pendingBooking.findOne({
      paypalOrderId: orderId,
      userId: user._id,
    });

    if (!pending) {
      return res.status(404).json({
        status: "error",
        message: "Payment request not found",
      });
    }

    // An already-paid request must never create another booking.
    if (pending.status === "paid") {
      return res.status(409).json({
        status: "error",
        message: "This payment has already been processed",
      });
    }

    if (
      pending.status !== "pending" ||
      pending.expiresAt <= new Date()
    ) {
      return res.status(400).json({
        status: "error",
        message: "Payment request has expired",
      });
    }

    // Check that these dates are still exclusively held
    // for this pending booking before proceeding.
    // Implement this check using your date-lock collection.

    const order = await getPayPalOrder(orderId);

  let payment;

  if (order.status === "COMPLETED") {
    // Payment was already captured successfully.
    payment = order;
  } else if (order.status === "APPROVED") {
    payment = await capturePayPalOrder(orderId);
  } else {
    return res.status(400).json({
      status: "error",
      message: "PayPal order is not approved",
    });
  }

  if (payment.status !== "COMPLETED") {
    return res.status(400).json({
      status: "error",
      message: "PayPal payment is not completed",
    });
  }

  const capture = payment.purchase_units?.[0]
    ?.payments?.captures?.[0];

  if (
    capture?.status !== "COMPLETED" ||
    capture?.amount?.currency_code !== pending.currency ||
    Math.round(Number(capture?.amount?.value) * 100) !==
      Math.round(pending.amount * 100) ||
    !capture?.id
  ) {
    return res.status(400).json({
      status: "error",
      message: "Payment amount or status is invalid",
    });
  }

  // Save reservation and update pending booking atomically.
  const session = await mongoose.startSession();

  let reservation: any;

  try {
    await session.withTransaction(async () => {

      // 1. Claim the pending booking.
      const claimed = await pendingBooking.findOneAndUpdate(
        {
          _id: pending._id,
          userId: user._id,
          status: "pending",
          expiresAt: { $gt: new Date() },
        },
        {
          $set: {
            status: "paid",
          },
        },
        {
          new: true,
          session,
        }
      );

      if (!claimed) {
        throw new Error("BOOKING_ALREADY_PROCESSED_OR_EXPIRED");
      }

      // 2. Get property information.
      const property = await PropertyModel.findById(
        claimed.propertyId
      ).session(session);

      if (!property || !property.admin?._id) {
        throw new Error("PROPERTY_OR_ADMIN_NOT_FOUND");
      }

      // 3. Prevent overlapping reservations.
      const reservationFilter = {
        propertyId: claimed.propertyId,
        reserveDates: {
          $not: {
            $elemMatch: {
              startDate: { $lt: claimed.endDate },
              endDate: { $gt: claimed.startDate },
            },
          },
        },
      };

      // 4. Create reservation or append to existing property document.
      reservation = await ReserveDateModel.findOneAndUpdate(
        reservationFilter,
        {
          $setOnInsert: {
            adminId: property.admin._id,
            property: property.toObject(),
          },
          $set: {
            paymentMethod: "paypal",
            paymentStatus: "paid",
          },
          $push: {
            reserveDates: {
              startDate: claimed.startDate,
              endDate: claimed.endDate,
              userId: claimed.userId,
              paymentMethod: "paypal",
              paymentStatus: "paid",
              paymentId: capture.id,
              amount: claimed.amount,
              currency: claimed.currency,
            },
          },
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          session,
        }
      );

      if (!reservation) {
        throw new Error("RESERVATION_CREATION_FAILED");
      }

      // 5. Increment property orders count.
      await PropertyModel.updateOne(
        { _id: claimed.propertyId },
        { $inc: { ordersNumbers: 1 } },
        { session }
      );
    });

    return res.status(200).json({
      status: "success",
      message: "Payment completed and reservation created successfully",
      data: {
        orderId,
        captureId: capture.id,
        reservationId: reservation?._id,
        paymentStatus: "paid",
      },
    });

  } catch (error) {
    console.error("Reservation transaction failed:", error);

    return res.status(500).json({
      status: "error",
      message: "Payment was captured but reservation persistence failed. Please contact support.",
      orderId,
      captureId: capture.id,
    });

  } finally {
    await session.endSession();
  }
      
  } catch (error) {
    console.error("PayPal capture failed:", error);

    return res.status(500).json({
      status: "error",
      message: "Unable to verify payment",
    });
  }
}
}