import verifyRazorPay from "../utils/verifyRazorpay.js";
import Order from "../models/orderModel.js";
import Payment from "../models/paymentModel.js";

export async function verifyPayment(req, res) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } =
      req.body;
    console.log(req.body);

    if (
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature ||
      !orderId
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing payment details" });
    }

    const isValidSignature = verifyRazorPay(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValidSignature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }

    const order = await Order.findById(orderId);
    if (!order || order.razorpayOrderId !== razorpayOrderId) {
      return res
        .status(400)
        .json({ success: false, message: "Order not found or mismatch" });
    }

    const payment = new Payment({
      orderId,
      razorpayPaymentId: razorpayPaymentId,
      razorpayOrderId: razorpayOrderId,
      razorpaySignature: razorpaySignature,
      amount: order.totalAmount,
      status: "captured",
    });

    await payment.save();

    order.status = "confirmed";
    await order.save();

    res.status(200).json({ success: true, message: "Payment Done !", payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
