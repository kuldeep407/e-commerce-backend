import express from "express";
import {
  getUsers,
  removeUser,
  userLogin,
  userSignup,
} from "../controllers/UserController.js";

const router = express.Router();

router.route("/user-signup").post(userSignup);
router.route("/user-login").post(userLogin);
router.route("/get-users").get(getUsers);
router.route("/remove-user/:userId").delete(removeUser);

export default router;
