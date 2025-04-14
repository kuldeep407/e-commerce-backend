import express from "express";
import { userAuth } from "../middleware/userAuth.js";
import { verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.route("/verify-payment").post(userAuth, verifyPayment);

export default router;
