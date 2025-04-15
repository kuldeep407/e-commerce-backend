import express from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrders,
} from "../controllers/orderController.js";
import { userAuth } from "../middleware/userAuth.js";

const router = express.Router();

router.route("/create-order").post(userAuth, createOrder);
router.route("/get-orders").get(userAuth, getOrders);
router.route("/get-all-orders").get(getAllOrders);
router.route("/remove-order/:orderId").delete(deleteOrder);

export default router;
