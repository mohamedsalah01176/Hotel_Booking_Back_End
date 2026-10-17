import mongoose from "mongoose";

const pendingBookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    propertyId: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    paypalOrderId: {
      type: String,
      unique: true,
      sparse: true,
    },
    stripeSessionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "expired"],
      default: "pending",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

pendingBookingSchema.index({ propertyId: 1, startDate: 1, endDate: 1 });

export default mongoose.model("PendingBooking", pendingBookingSchema);