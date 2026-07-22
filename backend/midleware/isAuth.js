import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
    try {
        let { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!verifiedToken) {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }
        req.userId = verifiedToken.userId;
        next();
    } catch (error) {
        console.error("Auth verification failed:", error.message || error);
        return res.status(401).json({ success: false, message: "Unauthorized access" });
    }
};

export { isAuth };