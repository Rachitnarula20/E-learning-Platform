import { log } from "console";
import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/courses.model.js";
import { Lecture } from "../models/lecture.model.js";
import * as fs from "fs";
import { rm } from "fs/promises"; // Use fs.promises for async operations
import { promisify } from "util";
import { User } from "../models/user.model.js";
import mongoose from "mongoose"; // Use import for mongoose

// Create a new course
export const createCourse = TryCatch(async (req, res) => {
    try {
        const { title, description, category, createdBy, duration, price } = req.body;
        const image = req.file;

        // Debugging Logs
        console.log("🔍 Request Headers:", req.headers);
        console.log("📄 Request Body:", req.body);
        console.log("🖼 Uploaded File:", req.file);

        // Check if all required fields are present
        if (!title || !description || !category || !createdBy || !duration || !price) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!image) {
            return res.status(400).json({ message: "Course image is required" });
        }

        await Courses.create({
            title,
            description,
            category,
            createdBy,
            image: image.path,
            duration,
            price,
        });

        res.status(201).json({ message: "Course Created Successfully" });
    } catch (error) {
        console.error("❌ Course Creation Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Add lectures to a course
export const addLectures = TryCatch(async (req, res) => {
    console.log("🔍 Starting addLectures for course ID:", req.params.id);
    console.log("📤 Request Headers:", req.headers);
    console.log("📤 Request Body:", req.body);
    console.log("🖼 Uploaded Files:", req.files);

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("❌ Invalid course ID:", id);
        return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await Courses.findById(id);
    if (!course) {
        console.log("❌ Course not found for ID:", id);
        return res.status(404).json({
            message: "No Course with this id",
        });
    }

    const { title, description } = req.body;
    const files = req.files;

    // Check if required fields are present
    if (!title || !description) {
        console.log("❌ Missing title or description:", { title, description });
        return res.status(400).json({
            message: "Title and description are required",
        });
    }
    if (!files || !files.video || !files.video[0]) {
        console.log("❌ No video file uploaded");
        return res.status(400).json({
            message: "Video file is required",
        });
    }

    const videoFile = files.video[0];

    console.log("📋 Creating lecture with data:", {
        title,
        description,
        video: videoFile.path,
        course: course._id,
    });

    try {
        const lecture = await Lecture.create({
            title,
            description,
            video: videoFile.path,
            course: course._id,
        });

        console.log("✅ Lecture created successfully:", lecture);
        res.status(201).json({
            message: "Lecture Added",
            lecture,
        });
    } catch (error) {
        console.error("❌ Lecture creation error:", error);
        return res.status(400).json({
            message: "Failed to create lecture",
            error: error.message,
        });
    }
});

// Delete a lecture
export const deleteLecture = TryCatch(async (req, res) => {
    const lecture = await Lecture.findById(req.params.id);

    if (!lecture) {
        return res.status(404).json({ message: "Lecture not found" });
    }

    try {
        // Delete the video file from the filesystem
        await rm(lecture.video); // Use async/await with fs.promises.rm
        console.log("Video Deleted");
        
        // Delete the lecture from the database
        await lecture.deleteOne();
        res.json({ message: "Lecture Deleted" });
    } catch (error) {
        console.error("❌ Error deleting lecture:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Delete a course (and associated lectures and files)
const unlinkAsync = promisify(fs.unlink);

export const deleteCourse = TryCatch(async (req, res) => {
    const course = await Courses.findById(req.params.id);

    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }

    try {
        // Find and delete all lectures associated with this course
        const lectures = await Lecture.find({ course: course._id });

        // Delete video files for all lectures
        await Promise.all(
            lectures.map(async (lecture) => {
                await unlinkAsync(lecture.video);
                console.log("Video deleted");
            })
        );

        // Delete the course image file
        await rm(course.image); // Use async/await with fs.promises.rm
        console.log("Image Deleted");

        // Delete all lectures for this course
        await Lecture.deleteMany({ course: req.params.id });

        // Delete the course
        await course.deleteOne();

        // Update users to remove this course from their subscriptions
        await User.updateMany({}, { $pull: { subscription: req.params.id } });

        res.json({
            message: "Course Deleted",
        });
    } catch (error) {
        console.error("❌ Error deleting course:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Get all stats (courses, lectures, users)
export const getAllStats = TryCatch(async (req, res) => {
    try {
        const totalCourses = (await Courses.find()).length;
        const totalLectures = (await Lecture.find()).length;
        const totalUsers = (await User.find()).length;

        const stats = {
            totalCourses,
            totalLectures,
            totalUsers,
        };

        res.json({
            stats,
        });
    } catch (error) {
        console.error("❌ Error fetching stats:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});