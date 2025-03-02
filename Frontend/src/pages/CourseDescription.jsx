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
  const { fetchCourse, course, fetchCourses, fetchMyCourse } = CourseData();
  const navigate = useNavigate();
  const { fetchUser } = UserData();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!course || course._id !== id) {
      fetchCourse(id);
    }
  }, [id]);

  const checkoutHandler = async () => {
    const token = localStorage.getItem("token"); // ✅ Ensure token is retrieved
    if (!token) {
        toast.error("Authentication required! Please log in again.");
        navigate("/login");
        return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/course/checkout/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Fix header format
        }
      );

      const options = {
        key: "rzp_test_XOrfnQQfYTZFkf",
        amount: data.order.amount,
        currency: "INR",
        name: "E-Learning",
        description: "Learning via E-Learning",
        image: "/logo.png",
        order_id: data.order.id,
        handler: async (response) => {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            response;

          try {
            const { data } = await axios.post(
              `${server}/api/course/verification/${id}`,
              { razorpay_order_id, razorpay_payment_id, razorpay_signature },
              { headers: { Authorization: `Bearer ${token}` } } // ✅ Fix header
            );

            await fetchUser();
            await fetchCourses();
            await fetchMyCourse();
            toast.success(data.message);
            navigate(`/payment-success/${razorpay_payment_id}`);
          } catch (error) {
            toast.error(error.response?.data?.message || "Payment failed");
          } finally {
            setLoading(false);
          }
        },
        theme: { color: "#3399cc" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Checkout failed");
      setLoading(false);
    }
};



  if (loading) return <div className="text-center py-6">Loading course details...</div>;
  if (!course) return <div className="text-center py-6">Course not found.</div>;

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

  const backendURL = "http://localhost:5000";
  const courseImage = image ? `${backendURL}/${image.replace(/\\/g, "/")}` : "fallback.jpg";
  const formattedDate = createdAt ? format(new Date(createdAt), "MMMM dd, yyyy") : "Unknown date";

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
          <span className="inline-block mt-2 bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
            {category || "Uncategorized"}
          </span>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <img
              src={courseImage}
              alt={title}
              className="w-full h-auto object-cover rounded shadow-md"
            />
          </div>

          <div className="flex flex-col justify-between">
            <section className="mb-4">
              <h2 className="text-xl font-semibold text-gray-700">About this Course</h2>
              <p className="text-gray-600 leading-relaxed">{description || "No description available."}</p>
            </section>

            <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div className="mb-2 sm:mb-0">
                <span className="text-gray-500">Duration:</span>{" "}
                <span className="text-gray-800 font-medium">{duration || "N/A"} hours</span>
              </div>
              <div>
                <span className="text-xl font-bold text-green-600">
                  {price ? `₹${price}` : "Free"}
                </span>
              </div>
            </section>

            <section className="mb-4">
              <p className="text-sm text-gray-500">
                Created by: <span className="font-medium text-gray-700">{createdBy || "Anonymous"}</span>
              </p>
              <p className="text-sm text-gray-500">
                Published on: <span className="font-medium text-gray-700">{formattedDate}</span>
              </p>
            </section>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={checkoutHandler}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-200"
              >
                Enroll Now
              </button>
              <button
                onClick={() => navigate("/courses")}
                className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded hover:bg-gray-400 transition duration-200"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDescription;
