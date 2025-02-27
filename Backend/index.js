import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./db/db.js";
import Razorpay from "razorpay"
import cors from "cors"
dotenv.config();

export const instance = new Razorpay({
    key_id: process.env.Razorpay_Key,
    key_secret:process.env.Razorpay_Secret
}) 


const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// ✅ Static file serving
app.use("/uploads", express.static("uploads"));

// ✅ Import Routes (Ensure Correct Paths)
import userRoutes from "./routes/user.routes.js";
import courseRoutes from "./routes/course.routes.js";
import adminRoutes from "./routes/admin.routes.js";

// ✅ Ensure Routes Are Used
app.use("/api/user", userRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/admin", adminRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
    connectDb();
});
