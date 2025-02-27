import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

// isAuth.js
export const isAuth = async (req, res, next) => {
    console.log("🔹 [isAuth] - Start");
    
    try {
      // 1) Log the headers
      console.log("🔹 [isAuth] - Headers:", req.headers);
  
      // 2) Extract token
      const authHeader = req.headers.authorization;
      console.log("🔹 [isAuth] - AuthHeader:", authHeader);
  
      // 3) If no token, return 401
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.error("❌ [isAuth] - No token!");
        return res.status(401).json({ message: "Unauthorized, token required" });
      }
  
      // 4) Verify token
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔹 [isAuth] - Decoded token:", decoded);
  
      // 5) Look up user
      req.user = await User.findById(decoded._id);
      console.log("🔹 [isAuth] - Found user:", req.user);
  
      // 6) If no user
      if (!req.user) {
        console.error("❌ [isAuth] - User not found in DB");
        return res.status(401).json({ message: "User not found" });
      }
  
      // 7) Good to go
      console.log("✅ [isAuth] - Auth successful!");
      next();
    } catch (error) {
      console.error("❌ [isAuth] - Error:", error);
      return res.status(500).json({ message: "Server error in isAuth", error: error.message });
    }
  };
  


// ✅ Updated Admin Check Middleware
export const isAdmin = (req, res, next) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not an admin" });
        }
        next(); // ✅ Allow admin to proceed
    } catch (error) {
        console.error("Admin Check Error:", error);
        res.status(500).json({ message: error.message });
    }
};
