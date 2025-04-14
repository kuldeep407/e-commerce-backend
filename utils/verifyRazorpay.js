import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config({ path: "config/.env" });

const verifyRazorPay = (
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature
) => {
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  console.log("Expected Signature: ", expectedSignature);
  console.log("Received Signature: ", razorpaySignature);

  return expectedSignature === razorpaySignature;
};

export default verifyRazorPay;
