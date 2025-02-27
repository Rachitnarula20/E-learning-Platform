import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL); // No need for deprecated options
        console.log("DB connected successfully");
    } catch (error) {
        console.error("DB connection failed:", error.message);
        console.error("Full error:", error);
    }
};
