import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { fileURLToPath } from "url";
import path from "path";

const app = express();

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://e-commerce-client-teal.vercel.app",
      "https://e-commerce-admin-umber.vercel.app",
      "https://inquisitive-strudel-58ef21.netlify.app",
      "https://magnificent-treacle-0c7374.netlify.app"
    ],
    credentials: true,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/images", express.static(path.join(__dirname, "uploads/images")));

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/UserRoutes.js";

app.use(cookieParser());
app.use(express.json());

app.use(productRoutes);
app.use(userRoutes);

app.use("/", (req, res) => {
  res.send("WORKING");
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
