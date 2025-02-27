import express from "express";
import { isAdmin, isAuth } from "../middlewares/isAuth.js";
import { addLectures, createCourse, deleteCourse, deleteLecture, getAllStats } from "../controllers/admin.controller.js";
import { uploadFiles } from "../middlewares/multer.middleware.js";

const router = express.Router();

// **Ensure Multer runs before request handler**
router.post("/course/new", isAuth, isAdmin, uploadFiles, createCourse);
router.post("/course/:id", isAuth, isAdmin, uploadFiles, addLectures);
router.delete("/course/:id", isAuth, isAdmin, deleteCourse);
router.delete("/lecture/:id", isAuth, isAdmin, deleteLecture);
router.get("/stats", isAuth, isAdmin, getAllStats)
export default router;
