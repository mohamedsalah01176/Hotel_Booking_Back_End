
import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    reserveDates: [
      {
        startDate: {
          type: Date,
          required: true,
        },
        endDate: {
          type: Date,
          required: true,
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        paymentMethod: {
          type: String,
          enum: ["cash", "paypal", "stripe"],
          default: "cash",
        },
        paymentStatus: {
          type: String,
          enum: ["pending", "paid", "failed", "refunded"],
          default: "pending",
        },
        paymentId: {
          type: String,
        },
        amount: {
          type: Number,
          min: 0,
        },
        currency: {
          type: String,
          default: "USD",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    propertyId: {
      type: String,
      required: true,
    },
    property: {
      type: Object,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "paypal", "stripe"],
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// One document per property lets a conditional update protect the whole
// property's calendar from concurrent bookings.
schema.index({ propertyId: 1 }, { unique: true });

export const ReserveDateModel = mongoose.model("reservDate", schema);
