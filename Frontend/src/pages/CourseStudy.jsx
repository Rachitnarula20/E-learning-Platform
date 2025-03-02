import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { server } from "../main";
import toast from "react-hot-toast";

const CourseStudy = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await axios.get(`${server}/api/course/${id}`, {
        });
        setCourse(data.course);
      } catch (err) {
        setError("Failed to load course details.");
        toast.error("Error fetching course details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <img
        src={`http://localhost:5000/${course.image}`}
        alt={course.title}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />
      <p className="text-gray-600 mb-2">{course.description}</p>
      <p className="text-gray-700 font-semibold">Category: {course.category}</p>
      <p className="text-gray-700">Duration: {course.duration} hours</p>
      <p className="text-gray-700">Instructor: {course.createdBy}</p>
      <p className="text-lg font-bold text-green-600">Price: ₹{course.price}</p>

      <Link
        to={`/course/lectures/${course._id}`}
        className="mt-6 block text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
      >
        Go to Lectures
      </Link>
    </div>
  );
};

export default CourseStudy;
