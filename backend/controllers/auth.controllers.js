import User from "../models/user.models.js";
import { genToken } from "../dB/token.js";

export const googleSignIn = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        // Ensure we always have a username: prefer provided name, otherwise derive from email
        const username = (name && String(name).trim()) || String(email).split("@")[0] || `user${Date.now() % 100000}`;

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ username, email });
        }
        let token = await genToken(user._id);
        const responseUser = user.toObject();
        responseUser.name = user.username;
        res.cookie("token", token, {
            httpOnly: true,
            path: "/",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        return res.status(200).json({ success: true, message: "User signed in successfully", user: responseUser, token });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ success: true, message: "User logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
