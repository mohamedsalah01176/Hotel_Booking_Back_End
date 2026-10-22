
import { Request, Response } from "express";
import mongoose from "mongoose";
import PropertyModel from "../model/property";
import pendingBooking from "../model/pendingBooking";
import { IUserPayload } from "../interface/user";
import stripe from "../service/stripe";
import UserModel from "../model/user";
import { ReserveDateModel } from "../model/ReservDates";
import { sendReservationEmailForUser } from "../util/sendEmail";
import type Stripe from "stripe";
type ReservationEmailData = {
  title: string;
  userEmail: string;
  adminEmail?: string;
};


export default class StripeController {
  async createCheckoutSession(req: Request, res: Response) {
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

      const conflictingReservation = await ReserveDateModel.exists({
        propertyId,
        reserveDates: {
          $elemMatch: {
            startDate: { $lt: endDate },
            endDate: { $gt: startDate },
          },
        },
      });

      if (conflictingReservation) {
        return res.status(409).json({
          status: "error",
          messageEn: "This property is already booked for the selected dates",
          messageAr: "هذا العقار محجوز بالفعل في التواريخ المحددة",
        });
      }

      const startDay = Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate()
      );

      const endDay = Date.UTC(
        endDate.getUTCFullYear(),
        endDate.getUTCMonth(),
        endDate.getUTCDate()
      );

      const nights = (endDay - startDay) / 86_400_000;

      if (!Number.isInteger(nights) || nights <= 0) {
        return res.status(400).json({
          status: "error",
          message: "Invalid reservation duration",
        });
      }

      const amount = Number(
        (nights * Number(property.nightPrice)).toFixed(2)
      );

      // Stripe expects an integer in the currency's
      // smallest unit. USD uses cents.
      const amountInCents = Math.round(amount * 100);

      if (
        !Number.isFinite(amount) ||
        amount <= 0 ||
        !Number.isSafeInteger(amountInCents)
      ) {
        return res.status(400).json({
          status: "error",
          message: "Invalid reservation amount",
        });
      }

      // TODO: Verify availability and acquire date locks
      // before allowing checkout.

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
        const session = await stripe.checkout.sessions.create({
          mode: "payment",

          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: `Hotel booking - ${propertyId}`,
                },
                unit_amount: amountInCents,
              },
              quantity: 1,
            },
          ],

          client_reference_id: pending._id.toString(),

          metadata: {
            pendingBookingId: pending._id.toString(),
            userId: user._id.toString(),
          },

          success_url:
            `${process.env.FRONTEND_BASEUSER}/payment/success` +
            "?session_id={CHECKOUT_SESSION_ID}",

          cancel_url:
            `${process.env.FRONTEND_BASEUSER}/payment/cancel`,
        });

        if (!session.url) {
          throw new Error("Stripe Checkout URL was not returned");
        }

        pending.stripeSessionId = session.id;
        await pending.save();

        return res.status(201).json({
          status: "success",
          sessionId: session.id,
          url: session.url,
          amount,
          currency: "USD",
        });
      } catch (error) {
        pending.status = "failed";
        await pending.save();
        throw error;
      }
    } catch (error) {
      console.error("Create Stripe session failed:", error);

      return res.status(500).json({
        status: "error",
        message: "Unable to create payment",
      });
    }
  }



  async webhook(req: Request, res: Response) {
      console.log("STRIPE WEBHOOK RECEIVED");

    const signature = req.headers["stripe-signature"];

    console.log("STRIPE SIGNATURE EXISTS:", !!signature);

    if (typeof signature !== "string") {
      return res.status(400).send("Missing Stripe signature");
    }

    let event: Stripe.Event;

    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!webhookSecret) {
        throw new Error("STRIPE_WEBHOOK_SECRET is missing");
      }

      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );
    } catch (error) {
      console.error("Stripe webhook verification failed:", error);
      return res.status(400).send("Invalid webhook signature");
    }

    if (event.type !== "checkout.session.completed") {
      return res.status(200).json({ received: true });
    }

    const checkoutSession = event.data.object as Stripe.Checkout.Session;

    if (checkoutSession.payment_status !== "paid") {
      return res.status(200).json({ received: true });
    }

    const pendingBookingId = checkoutSession.metadata?.pendingBookingId;
    const metadataUserId = checkoutSession.metadata?.userId;

    if (!pendingBookingId || !mongoose.isValidObjectId(pendingBookingId)) {
      console.error("Invalid pending booking metadata", {
        sessionId: checkoutSession.id,
      });

      return res.status(200).json({ received: true });
    }

    const emailData: {
      value: ReservationEmailData | null;
    } = {
      value: null,
    };

    const dbSession = await mongoose.startSession();

    try {
      await dbSession.withTransaction(async () => {
        const pending = await pendingBooking.findOne({
          _id: pendingBookingId,
          stripeSessionId: checkoutSession.id,
        }).session(dbSession);

        if (!pending) {
          throw new Error("Pending booking not found for this Stripe session");
        }

        // Prevent processing the same payment twice.
        if (pending.status === "paid") {
          return;
        }

        if (pending.status !== "pending") {
          throw new Error(`Booking cannot be paid from status: ${pending.status}`);
        }

        if (
          pending.userId.toString() !== metadataUserId ||
          checkoutSession.currency !== pending.currency.toLowerCase() ||
          checkoutSession.amount_total !== Math.round(pending.amount * 100)
        ) {
          throw new Error("Stripe payment details do not match the booking");
        }

        const property = await PropertyModel.findById(
          pending.propertyId
        ).session(dbSession);

        const user = await UserModel.findById(
          pending.userId
        ).session(dbSession);

        if (!property || !user) {
          throw new Error("Booking property or user was not found");
        }

        const rawAdmin = property.admin as any;
        const adminId = rawAdmin?._id ?? rawAdmin;

        if (!adminId) {
          throw new Error("Property administrator was not found");
        }

        const admin = await UserModel.findById(adminId).session(dbSession);

        const reservation = {
          startDate: pending.startDate,
          endDate: pending.endDate,
          userId: pending.userId,
          paymentMethod: "stripe" as const,
          paymentStatus: "paid" as const,
          paymentId: checkoutSession.id,
          amount: pending.amount,
          currency: pending.currency,
        };

        // Atomically append only when no existing reservation intersects this
        // interval. This is required even after the availability check above:
        // another customer can complete checkout in the meantime.
        const updated = await ReserveDateModel.updateOne(
          {
            propertyId: pending.propertyId,
            reserveDates: {
              $not: {
                $elemMatch: {
                  startDate: { $lt: pending.endDate },
                  endDate: { $gt: pending.startDate },
                },
              },
            },
          },
          { $push: { reserveDates: reservation } },
          { session: dbSession }
        );

        if (updated.matchedCount === 0) {
          const existing = await ReserveDateModel.findOne({
            propertyId: pending.propertyId,
          }).session(dbSession);

          if (existing) {
            throw new Error("This property is already booked for the selected dates");
          }

          console.log("111111111")
          try {
            await new ReserveDateModel({
              reserveDates: [reservation],
              adminId,
              propertyId: pending.propertyId.toString(),
              property: property.toObject(),
            }).save({ session: dbSession });
          } catch (error: any) {
            if (error?.code === 11000) {
              throw new Error("This property is already booked for the selected dates");
            }
            throw error;
          }
        }

        await PropertyModel.updateOne(
          { _id: property._id },
          { $inc: { ordersNumbers: 1 } },
          { session: dbSession }
        );

        console.log("4444444")

        pending.status = "paid";
        await pending.save({ session: dbSession });

        emailData.value = {
          title: property.titleEn || "Hotel reservation",
          userEmail: user.email,
          adminEmail: admin?.email,
        };
      });

    } catch (error) {
      console.error("Failed to save Stripe reservation:", error);

      // A server error asks Stripe to retry the webhook.
      return res.status(500).json({
        status: "error",
        message: "Unable to finalize reservation",
      });
    } finally {
      await dbSession.endSession();
    }

    // Send emails after the database transaction commits.
      const notification = emailData.value;

      if (notification) {
        try {
          const recipients = [
            notification.userEmail,
            notification.adminEmail,
            process.env.AUTHEMAIL,
          ].filter((email): email is string => Boolean(email));

          await Promise.all(
            [...new Set(recipients)].map((email) =>
              sendReservationEmailForUser(notification.title, email)
            )
          );
        } catch (error) {
          console.error("Reservation email sending failed:", error);
        }
      }

    return res.status(200).json({ received: true });
  }

}
