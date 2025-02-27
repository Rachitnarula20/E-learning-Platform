import { log } from "console";
import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/courses.model.js";
import { Lecture } from "../models/lecture.model.js";
import * as fs from "fs";
import { rm } from "fs";


import { promisify } from "util";
import {User} from "../models/user.model.js"

export const createCourse = TryCatch(async (req, res) => {
    try {
        const { title, description, category, createdBy, duration, price } = req.body;
        const image = req.file;

        // 🛠 Debugging Logs
        console.log("🔍 Request Headers:", req.headers);
        console.log("📄 Request Body:", req.body);
        console.log("🖼 Uploaded File:", req.file);

        // ✅ Check if all required fields are present
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


export const addLectures = TryCatch(async (req, res) => {
    const course = await Courses.findById(req.params.id)

    if(!course) res.status(404).json({
        message :"No Course with this id",
    });

    const {title, description} = req.body

    const file = req.file

    const lecture = await Lecture.create({
        title,
        description, 
        video : file?.path, 
        course:course._id
    });

    res.status(201).json({
       message :"Lecture Added",
        lecture ,

    })
})

export const deleteLecture = TryCatch(async (req, res) => {
    const lecture = await Lecture.findById(req.params.id)

    rm(lecture.video, ()=>{
        console.log("video Deleted");
        
    })
    await lecture.deleteOne()

    res.json({message : "Lecture Deleted"})
})

const unLikeAsync = promisify(fs.unlink)

export const deleteCourse = TryCatch(async (req, res) => {
    const course = await Courses.findById(req.params.id)

    const lectures = await Lecture.find({course: course.id})

    await Promise.all(
        lectures.map(async (lecture) => {
            await unLikeAsync(lecture.video);
            console.log("Video deleted");
        })
    )
    rm(course.image, ()=>{
        console.log("Image Deleted");  
    })

    await Lecture.find({course: req.params.id}).deleteMany()

    await course.deleteOne()

    await course.deleteOne()

    await User.updateMany({},{$pull : {subscription: req.params.id}})

    res.json({
        message : "Course Deleted",
    })
})
export const getAllStats = TryCatch(async (req, res) => {
    const totalCourses = (await Courses.find()).length;
    const totalLectures = (await Lecture.find()).length;
    const totalUsers = (await User.find()).length;

    const stats = {
        totalCourses,
        totalLectures,
        totalUsers,
    }
    res.json({
       stats 
    })
}) 

