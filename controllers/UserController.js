import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function userSignup(req, res) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exist, please login!" });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    const hashedPwd = await bcrypt.hash(password, 12);

    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }

    const user = new User({
      name,
      email,
      password: hashedPwd,
      cartData: cart,
    });
    await user.save();

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "5h" }
    );

    const mailOptions = {
      to: email,
      from: process.env.GMAIL_USER,
      subject: "Signup successful",
      text: ` Welcome to Shopper, Singup successfull with name: ${user.name}  email:  ${user.email}, Start exploring our services!. `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      success: true,
      message: "User singup successfull",
      user,
      token,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
}

export async function userLogin(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "No user found, please signup!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password!" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "5h" }
    );

    res.cookie("jwt", token, {
      secure: true,
      httpOnly: true,
      sameSite: "Strict",
    });

    return res
      .status(200)
      .json({ success: true, message: "User logged in", token });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
}

export async function getUsers(req, res) {
  try {
    const users = await User.find();
    if (users.length === 0 || !users) {
      return res
        .status(404)
        .json({ success: false, message: "No user found!" });
    }

    return res
      .status(200)
      .json({ success: true, message: "User fetched successfully", users });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
}

export async function removeUser(req, res) {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    await User.findByIdAndDelete(userId);

    return res
      .status(200)
      .json({ success: true, message: "User removed successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
}
