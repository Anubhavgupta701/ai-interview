import User from "../models/user.models.js";

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const responseUser = user.toObject();
        responseUser.name = user.username;
        return res.status(200).json({ success: true, user: responseUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "failed to get current user" });
    }
};