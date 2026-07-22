import Payment from "../models/payment.model.js";
import User from "../models/user.models.js";
import crypto from "crypto";
import razorpayInstance from "../services/razorpay.service.js";

export const createOrder = async (req, res) => {
    try {
        const { planId, amount, credits } = req.body;
        if (!amount || !credits) {
            return res.status(400).json({
                message: "Bad Request: Amount and credits required"
            });
        }
        const options = {
            amount: Number(amount) * 100, // Amount in paise
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        };
        const order = await razorpayInstance.orders.create(options);

        await Payment.create({
            userId: req.userId,
            planId,
            amount: order.amount / 100,
            credits,
            razorpayOrderId: order.id,
            status: "pending"
        });

        return res.json(order);
    } catch (error) {
        return res.status(500).json({ message: `failed to create razorpay order : ${error.message}` });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { paymentId, orderId, signature } = req.body;

        if (!paymentId || !orderId || !signature) {
            return res.status(400).json({ message: "Missing required payment parameters" });
        }

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${orderId}|${paymentId}`)
            .digest("hex");

        if (expectedSignature !== signature) {
            return res.status(400).json({ message: "invalid payment signature" });
        }

        const payment = await Payment.findOne({ razorpayOrderId: orderId });
        if (!payment) {
            return res.status(404).json({ message: "payment not found" });
        }
        if (payment.status === "success") {
            return res.status(400).json({ message: "payment already completed" });
        }

        // Update payment status
        payment.status = "success";
        payment.razorpayPaymentId = paymentId;
        await payment.save();

        // Increment user credits
        const updatedUser = await User.findByIdAndUpdate(
            payment.userId,
            { $inc: { credits: payment.credits } },
            { new: true }
        );

        return res.json({
            message: "Payment verified successfully",
            user: updatedUser
        });
    } catch (error) {
        return res.status(500).json({ message: `failed to verify razorpay payment : ${error.message}` });
    }
};