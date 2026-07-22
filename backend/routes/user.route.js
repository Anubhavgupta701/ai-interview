import express from "express";
import { isAuth } from "../midleware/isAuth.js";
import { getCurrentUser } from "../controllers/user.controllers.js";

const userRouter = express.Router();


userRouter.get("/currentUser",isAuth,getCurrentUser);

export default userRouter;