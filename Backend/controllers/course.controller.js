import TryCatch            from "../middlewares/TryCatch.js";
import { Courses }         from "../models/courses.model.js";
import { Lecture }         from "../models/lecture.model.js";
import { User }            from "../models/user.model.js";
import mongoose            from "mongoose";
import crypto              from "crypto";
import { instance }        from "../index.js";
import { Payment }         from "../models/payment.model.js";
import { normalisePath }   from "../utils/normalisePath.js";     // ✅ NEW

/* ────────────────────────────────────────────────────────── */
/* Fetch ALL courses                                          */
/* ────────────────────────────────────────────────────────── */
export const getAllCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find().lean();          // lean() gives plain objects
  courses.forEach(c => (c.image = normalisePath(c.image)));
  res.json({ courses });
});

/* ────────────────────────────────────────────────────────── */
/* Fetch ONE course by ID                                     */
/* ────────────────────────────────────────────────────────── */
export const getSingleCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id).lean();
  if (!course) return res.status(404).json({ message: "Course not found" });
  course.image = normalisePath(course.image);
  res.json({ course });
});

/* ────────────────────────────────────────────────────────── */
/* Fetch ALL lectures for a course                            */
/* ────────────────────────────────────────────────────────── */
export const fetchLectures = TryCatch(async (req, res) => {
  const lectures = await Lecture.find({ course: req.params.id });
  const user     = await User.findById(req.user._id);

  if (user.role === "admin" || user.subscription.includes(req.params.id))
    return res.json({ lectures });

  return res.status(403).json({ message: "You are not subscribed to this course" });
});

/* ────────────────────────────────────────────────────────── */
/* Fetch ONE lecture by ID                                    */
/* ────────────────────────────────────────────────────────── */
export const fetchLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);
  if (!lecture) return res.status(404).json({ message: "Lecture not found" });

  const user = await User.findById(req.user._id);
  if (user.role === "admin" || user.subscription.includes(lecture.course))
    return res.json({ lecture });

  return res.status(403).json({ message: "You have not subscribed to the course" });
});

/* ────────────────────────────────────────────────────────── */
/* Return courses the user has purchased / subscribed to      */
/* ────────────────────────────────────────────────────────── */
export const getMyCourse = TryCatch(async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "User authentication failed" });
  if (!Array.isArray(req.user.subscription) || req.user.subscription.length === 0)
    return res.json({ courses: [] });

  const ids = req.user.subscription.filter(mongoose.isValidObjectId);
  if (ids.length === 0) return res.json({ courses: [] });

  const courses = await Courses.find({ _id: { $in: ids } }).lean();
  courses.forEach(c => (c.image = normalisePath(c.image)));
  res.json({ courses });
});

/* ────────────────────────────────────────────────────────── */
/* Checkout (students only)                                   */
/* ────────────────────────────────────────────────────────── */
export const checkout = TryCatch(async (req, res) => {
  const user   = await User.findById(req.user._id);
  const course = await Courses.findById(req.params.id);

  if (user.role === "admin")
    return res.status(403).json({ message: "Admins cannot purchase courses" });

  if (user.subscription.includes(course._id))
    return res.status(400).json({ message: "You already have this course" });

  const order = await instance.orders.create({
    amount: course.price * 100,
    currency: "INR",
  });

  res.status(201).json({ order, course });
});

/* ────────────────────────────────────────────────────────── */
/* Payment verification                                       */
/* ────────────────────────────────────────────────────────── */
export const paymentVerification = TryCatch(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature)
    return res.status(400).json({ message: "Payment verification failed" });

  await Payment.create({ razorpay_order_id, razorpay_payment_id, razorpay_signature });

  const user   = await User.findById(req.user._id);
  const course = await Courses.findById(req.params.id);

  user.subscription.push(course._id);
  await user.save();

  res.status(200).json({ message: "Course purchased successfully" });
});
