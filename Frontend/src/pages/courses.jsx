import React, { useState, useEffect } from "react";
import { CourseData } from "../context/CourseContext";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import axios from "axios";
import { server } from "../main";
import toast from "react-hot-toast";

const CoursesPage = () => {
  const { courses, fetchCourses } = CourseData();
  const { isAuth, user } = UserData(); // ✅ Moved inside function
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        try {
            setLoading(true);
            await fetchCourses();
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    }
    fetchData();
}, []);

  // Filtering logic
  let filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sorting logic
  if (sortOption === "price-asc") {
    filteredCourses.sort((a, b) => a.price - b.price);
  } else if (sortOption === "price-desc") {
    filteredCourses.sort((a, b) => b.price - a.price);
  } else if (sortOption === "duration-asc") {
    filteredCourses.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
  } else if (sortOption === "duration-desc") {
    filteredCourses.sort((a, b) => parseInt(b.duration) - parseInt(a.duration));
  }

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
          {Array.from(new Set(courses.map((course) => course.category))).map(
            (category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            )
          )}
        </select>

        <select
          className="w-full md:w-1/5 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
          <option value="duration-asc">Duration (Short to Long)</option>
          <option value="duration-desc">Duration (Long to Short)</option>
        </select>
      </div>

      {/* All Courses */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">All Courses</h2>
        {filteredCourses.length === 0 ? (
          <p className="text-center text-gray-600">No courses found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCourses.map((course) => (
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
      </section>
    </div>
  );
};

export default CoursesPage;

const CourseCard = ({ course, isAuth, user, fetchCourses }) => {
  const navigate = useNavigate();

  // Function to delete course (only for admin)
  const deleteCourse = async () => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`${server}/api/courses/${course._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Course deleted successfully");
      fetchCourses(); // Refresh course list
    } catch (error) {
      toast.error("Failed to delete course");
    }
  };

  return (
    <div className="bg-white rounded-md shadow hover:shadow-lg transition-shadow p-4 relative">
      {course.isNew && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold py-1 px-2 rounded">
          New
        </div>
      )}

      <div className="w-full h-40 overflow-hidden rounded-md mb-4 relative">
        <img
          src={`http://localhost:5000/${course.image}`}
          alt={course.title}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform"
        />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-bold text-gray-800">{course.title}</h3>
        <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
          {course.category}
        </span>

        {/* Price & Duration */}
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xl font-semibold text-gray-900">₹{course.price}</p>
          <p className="text-sm text-gray-500 flex items-center">
            <span className="mr-1">⏳</span> {course.duration} hours
          </p>
        </div>

        {/* Study / Get Started Button Logic */}
        {isAuth ? (
          <>
            {user && user.role !== "admin" ? (
              <>
                {user.subscription.includes(course._id) ? (
                  <button
                    onClick={() => navigate(`/courses/${course._id}`)}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2 font-semibold shadow-md"
                  >
                    Study
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/courses/${course._id}`)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 font-semibold shadow-md"
                  >
                    Get Started
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => navigate(`/courses/${course._id}`)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2 font-semibold shadow-md"
              >
                Study
              </button>
            )}
          </>
        ) : (
          <button onClick={() => navigate("/login")} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 font-semibold shadow-md">
            Get Started
          </button>
        )}

        {/* Admin Delete Course Button */}
        {isAuth && user.role === "admin" && (
          <button
            onClick={deleteCourse}
            className="mt-2 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors block text-center"
          >
            Delete Course
          </button>
        )}
      </div>
    </div>
  );
};
