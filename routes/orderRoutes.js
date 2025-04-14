import express from "express";
import { createOrder, getOrders } from "../controllers/orderController.js";
import { userAuth } from "../middleware/userAuth.js";

const router = express.Router();

router.route("/create-order").post(userAuth, createOrder);
router.route("/get-orders").get(userAuth, getOrders);

export default router;
