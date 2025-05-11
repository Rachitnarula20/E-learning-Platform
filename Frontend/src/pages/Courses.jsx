import React, { useState, useEffect } from "react";
import { CourseData } from "../context/CourseContext";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import axios from "axios";
import { SERVER as server } from "../config";
import toast from "react-hot-toast";

const CoursesPage = () => {
  const { courses, fetchCourses } = CourseData();
  const { isAuth, user } = UserData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        await fetchCourses();
      } catch (error) {
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  // Filtering logic
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sorting logic
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortOption === "price-asc") return a.price - b.price;
    if (sortOption === "price-desc") return b.price - a.price;
    if (sortOption === "duration-asc") return a.duration - b.duration;
    if (sortOption === "duration-desc") return b.duration - a.duration;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Explore Our Courses
      </h1>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search courses..."
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="w-full md:w-1/5 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {[...new Set(courses.map(course => course.category))].map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          className="w-full md:w-1/5 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="duration-asc">Duration: Short to Long</option>
          <option value="duration-desc">Duration: Long to Short</option>
        </select>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : sortedCourses.length === 0 ? (
        <div className="text-center text-gray-600 py-8">
          No courses found matching your criteria
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedCourses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              isAuth={isAuth}
              user={user}
              fetchCourses={fetchCourses}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CourseCard = ({ course, isAuth, user, fetchCourses }) => {
  const navigate = useNavigate();

  const deleteCourse = async () => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`${server}/api/courses/${course._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("Course deleted successfully");
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete course");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 relative">
      {course.isNew && (
        <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          New
        </span>
      )}

      <div className="w-full h-48 overflow-hidden rounded-md mb-4">
        <img
          src={`${server}/${course.image}`}
          alt={course.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-bold text-gray-800 truncate">{course.title}</h3>
        <span className="inline-block bg-blue-100 text-blue-600 text-sm px-2 py-1 rounded-full">
          {course.category}
        </span>

        <div className="flex justify-between items-center mt-2">
          <p className="text-xl font-semibold text-gray-900">
            ₹{course.price || "Free"}
          </p>
          <p className="text-sm text-gray-500 flex items-center">
            <span className="mr-1">⏳</span>
            {course.duration} hrs
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          {isAuth ? (
            user?.role === "admin" ? (
              <>
                <button
                  onClick={() => navigate(`/course/lectures/${course._id}`)}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Manage Lectures
                </button>
                <button
                  onClick={deleteCourse}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Course
                </button>
              </>
            ) : user?.subscription?.includes(course._id) ? (
              <button
                onClick={() => navigate(`/course/study/${course._id}`)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Continue Learning
              </button>
            ) : (
              <button
                onClick={() => navigate(`/courses/${course._id}`)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Enroll Now
              </button>
            )
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login to Enroll
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;