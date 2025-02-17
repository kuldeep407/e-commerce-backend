import express from "express"
import { userLogin, userSignup } from "../controllers/UserController.js";

const router = express.Router()

router.route("/user-signup").post(userSignup);
router.route("/user-login").post(userLogin);


export default router