import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const userAuth = async (req, res, next) => {
  const token = req.headers["auth-token"];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized, no token provided!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token!" });
  }
};
