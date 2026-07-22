import mongoose from "mongoose";

const connectdB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        console.log("Db connected successfully");

        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB disconnected. Retrying in 5s...");
            setTimeout(connectdB, 5000);
        });

        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err.message);
        });

    } catch (error) {
        console.log("Error connecting to database:", error.message);
        console.log("Retrying in 10s...");
        setTimeout(connectdB, 10000);
    }
};

export default connectdB;