import express from "express";
import multer from "multer";
import path from "path";

import {
  AddProduct,
  addToCart,
  FetchAllProducts,
  fetchNewCollection,
  fetchPopularWomenCategoryProducts,
  GetAllCartItems,
  removeFromCart,
  removeProduct,
  uploadFile,
} from "../controllers/productController.js";

import { userAuth } from "../middleware/userAuth.js";

const router = express();

const storage = multer.diskStorage({
  destination: "./uploads/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

router.route("/upload").post(upload.single("product"), uploadFile);
router.route("/add-product").post(AddProduct);
router.route("/all-products").get(FetchAllProducts);
router.route("/remove-product/:id").delete(removeProduct);
router.route("/get-new-collection").get(fetchNewCollection);
router
  .route("/get-popular-women-category-products")
  .get(fetchPopularWomenCategoryProducts);
router.route("/add-to-cart").post(userAuth, addToCart);
router.route("/remove-product-from-cart").post(userAuth, removeFromCart);
router.route("/get-all-cart-items").get(userAuth, GetAllCartItems);

export default router;
