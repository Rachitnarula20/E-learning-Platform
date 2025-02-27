import express from "express";
import { 
    fetchLectures, 
    fetchLecture, 
    getAllCourses, 
    getSingleCourse, 
    getMyCourse, 
    checkout,
    paymentVerification
} from "../controllers/course.controller.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

// ✅ Load confirmation

// 📌 Public routes (No authentication required)
router.get("/all", getAllCourses);

// 🔐 Protected routes (Require authentication)
router.get("/mycourse", isAuth, getMyCourse);
router.get("/lectures/:id", isAuth, fetchLectures);
router.get("/:id", getSingleCourse);
router.get("/lecture/:id", isAuth, fetchLecture);
router.post("/checkout/:id", isAuth, checkout)
router.post("/verification/:id", isAuth, paymentVerification)
// ✅ 404 handler for unmatched routes
router.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

export default router;
