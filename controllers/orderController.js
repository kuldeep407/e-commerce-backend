import Razorpay from "razorpay";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function createOrder(req, res) {
  try {
    const { products, shippingAddress } = req.body;
    const userId = req.user.id;

    console.log("line 17", userId);

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Products are required" });
    }

    if (
      !shippingAddress ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping address is required",
      });
    }

    let totalAmount = 0;
    const validProducts = [];

    for (const item of products) {
      const { productId, quantity } = item;
      if (!productId || !quantity || quantity < 1) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid product or quantity" });
      }

      const product = await Product.findById(productId);
      if (!product || !product.available) {
        return res.status(400).json({
          success: false,
          message: `Product ${productId} not found or unavailable`,
        });
      }

      const price = parseFloat(product.new_price);
      if (isNaN(price)) {
        return res.status(400).json({
          success: false,
          message: `Invalid price for product ${productId}`,
        });
      }

      totalAmount += price * quantity;
      validProducts.push({ productId, quantity });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    const order = new Order({
      userId,
      products: validProducts,
      totalAmount,
      shippingAddress,
      razorpayOrderId: razorpayOrder.id,
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order created successfully",
      order,
      razorpayOrderId: razorpayOrder.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getOrders(req, res) {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate({
      path: "products.productId",
      select: "name image new_price",
    });

    res
      .status(200)
      .json({ success: true, message: "Orders fetched successfully", orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
