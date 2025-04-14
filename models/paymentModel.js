import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
      },
      razorpayPaymentId: {
        type: String,
        required: true,
      },
      razorpayOrderId: {
        type: String,
        required: true,
      },
      razorpaySignature: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: "INR",
      },
      status: {
        type: String,
        enum: ["created", "authorized", "captured", "failed"],
        default: "created",
      },
    },
    { timestamps: true }
  );
  
export default mongoose.model("Payment", paymentSchema);
