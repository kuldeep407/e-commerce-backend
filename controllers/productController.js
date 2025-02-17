import Product from "../models/productModel.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import User from "../models/userModel.js";

const PORT = process.env.PORT || 4000;

export async function uploadFile(req, res) {
  try {
    res.json({
      success: true,
      image_url: `http://localhost:${PORT}/images/${req.file.filename}`,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error !" });
  }
}

export async function AddProduct(req, res) {
  try {
    let last_product = await Product.findOne({}, {}, { sort: { id: -1 } });

    let newId = last_product ? last_product.id + 1 : 1;

    const { name, image, category, old_price, new_price } = req.body;

    const product = new Product({
      id: newId,
      name,
      image,
      category,
      old_price,
      new_price,
    });

    await product.save();
    res.status(200).json({ success: true, message: "Product saved", product });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
}

export async function removeProduct(req, res) {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findOneAndDelete({
      id: parseInt(id, 10),
    });

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function FetchAllProducts(req, res) {
  try {
    const products = await Product.find({});

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No product found !" });
    }

    res
      .status(200)
      .json({ success: true, message: "Product fetched", products });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error !" });
  }
}

export async function fetchNewCollection(req, res) {
  try {
    const products = await Product.find({});

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No product found !" });
    }

    let newCollection = products.slice(1).slice(-8);

    res.status(200).json({
      success: true,
      message: "New Collection fetched",
      newCollection,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error !" });
  }
}

export async function fetchPopularWomenCategoryProducts(req, res) {
  try {
    const products = await Product.find({ category: "women" });

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No product found !" });
    }

    let popularInWomen = products.slice(0, 4);
    res.status(200).json({
      success: true,
      message: "Popular women category products fetched",
      popularInWomen,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error !" });
  }
}

export async function addToCart(req, res) {
  try {
    const user = req.user;
    const userData = await User.findOne({ _id: user.id });

    if (!userData.cartData) {
      userData.cartData = {};
    }

    // Increase item count or add new item
    userData.cartData[req.body.itemId] =
      (userData.cartData[req.body.itemId] || 0) + 1;

    await User.findByIdAndUpdate(
      user.id,
      { $set: { cartData: userData.cartData } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Added to cart",
      cartData: userData.cartData,
    });
  } catch (err) {
    console.error("Error in addToCart:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
}

export async function removeFromCart(req, res) {
  try {
    const user = req.user;
    const userData = await User.findOne({ _id: user.id });

    if (!userData.cartData) {
      userData.cartData = {};
    }

    const itemId = req.body.itemId;

    if (userData.cartData[itemId] && userData.cartData[itemId] > 1) {
      userData.cartData[itemId] -= 1;
    } else {
      delete userData.cartData[itemId];
    }

    await User.findByIdAndUpdate(
      user.id,
      { $set: { cartData: userData.cartData } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Removed from cart",
      cartData: userData.cartData,
    });
  } catch (err) {
    console.error("Error in removeFromCart:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
}

export async function GetAllCartItems(req, res) {
  try {
    const user = req.user;
    const userData = await User.findById(user.id);
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    res.status(200).json({
      success: true,
      cartData: userData.cartData || {},
    });
  } catch (err) {
    console.error("Error fetching cart items:", err);
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
}
