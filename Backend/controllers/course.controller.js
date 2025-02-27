import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/courses.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import crypto from "crypto"
import { instance } from "../index.js";
import {Payment} from "../models/payment.model.js"

export const getAllCourses = TryCatch(async (req, res ) => {
    const courses = await Courses.find()
    res.json({
        courses, 
    })
});

export const getSingleCourse = TryCatch(async (req, res) => {
    const course =  await Courses.findById(req.params.id)

    res.json({
        course,
    })
});

export const fetchLectures = TryCatch(async (req, res) => {
    const lectures =  await Lecture.find({course : req.params.id})

    const user =  await User.findById(req.user._id)

    if(user.role === "admin"){
        return res.json({ lectures});
    }

    if(!user.subscription.includes(req.params.id))
         return res.status(400).json 
    ({
            message : "You are mot subscribed to this course",
    });

    res.json ({lectures})
});

export const fetchLecture = TryCatch(async (req, res) => {
    const lecture = await Lecture.findById(req.params.id);

    if (!lecture) {
        return res.status(404).json({ message: "Lecture not found" });
    }

    const user = await User.findById(req.user._id);

    // If the user is an admin, return the lecture details
    if (user.role === "admin") {
        return res.json({ lecture });
    }

    // If the user is not subscribed to the course, deny access
    if (!user.subscription.includes(lecture.course)) {
        return res.status(403).json({ message: "You have not subscribed to the course" });
    }

    // If the user is subscribed, return the lecture details
    res.json({ lecture });
});

export const getMyCourse = TryCatch(async (req, res) => {
    console.log("🔍 [getMyCourse] - Function triggered");

    try {
        console.log("🛠 [getMyCourse] - Checking user data...");
        if (!req.user) {
            console.error("❌ [getMyCourse] - User object is missing");
            return res.status(401).json({ message: "User authentication failed" });
        }

        console.log("🛠 [getMyCourse] - Checking user subscription...");
        if (!req.user.subscription || !Array.isArray(req.user.subscription)) {
            console.warn("⚠️ [getMyCourse] - No subscriptions found for user");
            return res.json({ courses: [] });
        }

        console.log("🔍 [getMyCourse] - Subscription IDs:", req.user.subscription);

        // Validate subscription IDs
        const validSubscriptionIds = req.user.subscription
            .filter(sub => mongoose.isValidObjectId(sub))
            .map(sub => new mongoose.Types.ObjectId(sub));

        console.log("✅ [getMyCourse] - Valid Subscription IDs:", validSubscriptionIds);

        // If no valid subscriptions, return empty array
        if (validSubscriptionIds.length === 0) {
            console.warn("⚠️ [getMyCourse] - No valid course subscriptions found.");
            return res.json({ courses: [] });
        }

        console.log("🛠 [getMyCourse] - Fetching courses from DB...");
        const courses = await Courses.find({ _id: { $in: validSubscriptionIds } });

        console.log("✅ [getMyCourse] - Courses Found:", courses);
        res.json({ courses });
    } catch (error) {
        console.error("🔥 [getMyCourse] - ERROR:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            stack: error.stack, // 🔹 Add stack trace for debugging
        });
    }
});


export const checkout = TryCatch(async (req,res) => {
    const user = await User.findById(req.user._id)

    const course = await Courses.findById(req.params.id)

    if(user.subscription.includes(course._id)){
        return res.status(400).json({
            message:"You already have this course"
        })
    }

    const options = {
        amount: Number(course.price *100),
        currency :"INR",
    }

    const order = await instance.orders.create(options);

    res.status(201).json({
        order,
        course,
    });
});

export const paymentVerification = TryCatch(async (req,res) => {
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto.createHmac("sha256", process.env.Razorpay_Secret)
    .update(body)
    .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if(isAuthentic){
        await Payment.create({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        });

        const user = await User.findById(req.user._id)

        const course = await Courses.findById(req.params.id)

        user.subscription.push(course._id)

        await user.save()

        res.status(200).json({
            message:"Course Purchased Successfully"
        })
    }else{
        res.status(400).json({
            message:"Payment Failed"
        })
    }
})




