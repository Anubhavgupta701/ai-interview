import "dotenv/config";
import express from "express";
import connectdB from "./dB/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import { isAuth } from "./midleware/isAuth.js";
import { googleSignIn, logout } from "./controllers/auth.controllers.js";

import dns from "dns";
import interviewRouter from "./routes/interview.route.js";
import paymentRouter from "./routes/payment.route.js";
dns.setServers(["1.1.1.1","8.8.8.8"]);
const app=express();

const allowedOrigins = [
    process.env.CORS_ORIGIN,
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));


const PORT=process.env.PORT || 8000;

connectdB();



app.use(express.json());
app.use(cookieParser());


app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.use("/api/interview",interviewRouter)
app.use("/api/payment" , paymentRouter)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});