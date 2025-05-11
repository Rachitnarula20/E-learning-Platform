// Backend/index.js

import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./db/db.js";
import Razorpay from "razorpay";
import cors from "cors";

// These two imports are needed to compute __dirname correctly in ESM
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();

// Razorpay instance
export const instance = new Razorpay({
  key_id:     process.env.Razorpay_Key,
  key_secret: process.env.Razorpay_Secret,
});

const app = express();

// ─── Compute __dirname in ES modules ─────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

// ✅ Middleware
app.use(express.json());
app.use(
  cors({
    origin:      "https://e-learning-platform-roan.vercel.app",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

// ─── Serve the real uploads folder ────────────────────────────────────────────
// Now /uploads/whatever.png will map to <project-root>/Backend/uploads/whatever.png
app.use(
  "/uploads",
  express.static(join(__dirname, "uploads"))
);

// ✅ Import & mount your routers
import userRoutes   from "./routes/user.routes.js";
import courseRoutes from "./routes/course.routes.js";
import adminRoutes  from "./routes/admin.routes.js";

app.use("/api/user",   userRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/admin",  adminRoutes);

// ─── Start server & connect DB ──────────────────────────────────────────────
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  connectDb();
});
