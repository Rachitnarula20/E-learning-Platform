import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CourseData } from "../context/CourseContext";
import { format } from "date-fns";
import { server } from "../main";
import toast from "react-hot-toast";
import { UserData } from "../context/UserContext";
import axios from "axios";

const CourseDescription = () => {
  const { id } = useParams();
  const { fetchCourse, course } = CourseData();
  const navigate = useNavigate();
  const { user } = UserData();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!course || course._id !== id) {
      fetchCourse(id);
    }
  }, [id]);

  const checkoutHandler = async () => {
    if (user?.role === "admin") {
      toast.error("Admins cannot enroll in courses");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to enroll");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/course/checkout/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: "rzp_test_XOrfnQQfYTZFkf", 
        amount: data.order.amount,
        currency: "INR",
        name: "E-Learning",
        description: "Course Enrollment",
        image: "/logo.png",
        order_id: data.order.id,
        handler: async (response) => {
          try {
            await axios.post(
              `${server}/api/course/verification/${id}`,
              response,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate(`/payment-success/${response.razorpay_payment_id}`);
          } catch (error) {
            toast.error(error.response?.data?.message || "Payment verification failed");
          }
        },
        theme: { color: "#3399cc" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Enrollment failed");
    } finally {
      setLoading(false);
    }
  };

  if (!course) return <div className="text-center py-6">Loading course...</div>;

  const {
    title,
    description,
    image,
    price,
    duration,
    category,
    createdBy,
    createdAt,
  } = course;

  const courseImage = image ? `${server}/${image}` : "/default-course.jpg";
  const formattedDate = format(new Date(createdAt), "MMMM dd, yyyy");

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Course Header */}
          <div className="p-8 border-b">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                <p className="mt-2 text-gray-500">
                  Created by: <span className="text-gray-700">{createdBy?.name || "Admin"}</span>
                </p>
              </div>
              <span className="mt-4 md:mt-0 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm">
                {category}
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Course Image */}
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <img
                src={courseImage}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Course Details */}
            <div className="space-y-6">
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-4">Course Description</h2>
                <p className="text-gray-600 leading-relaxed">
                  {description || "No description available."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="text-lg font-medium">{duration} hours</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-lg font-medium text-green-600">
                    {price ? `₹${price}` : "Free"}
                  </p>
                </div>
              </div>

              {/* Enrollment Section */}
              <div className="space-y-4">
                <button
                  onClick={checkoutHandler}
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                >
                  {loading ? "Processing..." : "Enroll Now"}
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Back to Courses
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDescription;