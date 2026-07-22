import express from "express";
import { googleSignIn, logout } from "../controllers/auth.controllers.js";
const authRouter = express.Router();

authRouter.route("/google")
  .get((req, res) => {
    return res.status(405).json({
      success: false,
      message: "Use POST /api/auth/google to sign in with Google. GET is not supported.",
    });
  })
  .post(googleSignIn);

authRouter.get("/logout",logout);

export default authRouter;