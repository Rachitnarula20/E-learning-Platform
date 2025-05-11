// src/pages/Lecture.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { SERVER as server } from "../config";
import { UserData } from "../context/UserContext";
import toast from "react-hot-toast";

// Helper to normalize and prepend the server base for any media path
const buildMediaUrl = (p = "") => {
  const clean = p.replace(/\\/g, "/");              // backslashes → slashes
  if (clean.startsWith("http")) return clean;       // already a URL
  const withSlash = clean.startsWith("/") ? clean : `/${clean}`;
  return `${server}${withSlash}`;
};

const Lecture = () => {
  const { user } = UserData();
  const { id: courseId } = useParams();
  const [lectures, setLectures] = useState([]);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLecture, setNewLecture] = useState({
    title: "",
    description: "",
    video: null,
  });

  const token = localStorage.getItem("token");

  const fetchLectures = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${server}/api/course/lectures/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLectures(data.lectures);
      setError("");

      if (data.lectures.length > 0) {
        fetchLectureDetails(data.lectures[0]._id);
      }
    } catch (err) {
      setError("Failed to load lectures");
      toast.error("Failed to load lectures");
    } finally {
      setLoading(false);
    }
  };

  const fetchLectureDetails = async (lectureId) => {
    try {
      const { data } = await axios.get(
        `${server}/api/course/lecture/${lectureId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentLecture(data.lecture);
    } catch (err) {
      setError("Failed to load lecture details");
      toast.error("Failed to load lecture details");
    }
  };

  const handleDelete = async (lectureId) => {
    if (!window.confirm("Are you sure you want to delete this lecture?"))
      return;
    try {
      await axios.delete(`${server}/api/admin/lecture/${lectureId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLectures((prev) => prev.filter((l) => l._id !== lectureId));
      if (currentLecture?._id === lectureId) setCurrentLecture(null);
      toast.success("Lecture deleted successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete lecture");
      toast.error(err.response?.data?.message || "Failed to delete lecture");
    }
  };

  const handleAddLecture = async (e) => {
    e.preventDefault();
    if (!newLecture.title || !newLecture.description || !newLecture.video) {
      toast.error("Please fill in all fields and select a video");
      return;
    }
    const formData = new FormData();
    formData.append("title", newLecture.title);
    formData.append("description", newLecture.description);
    formData.append("video", newLecture.video);

    try {
      const { data } = await axios.post(
        `${server}/api/admin/course/${courseId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setShowAddForm(false);
      setNewLecture({ title: "", description: "", video: null });
      await fetchLectures();
      setCurrentLecture(data.lecture);
      toast.success("Lecture added successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add lecture");
      toast.error("Failed to add lecture");
    }
  };

  useEffect(() => {
    fetchLectures();
  }, [courseId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return <div className="p-4 text-red-500 text-center">{error}</div>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 bg-gray-50 p-4 border-r">
        {user?.role === "admin" && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors mb-4"
          >
            {showAddForm ? "Cancel" : "Add Lecture"}
          </button>
        )}

        {showAddForm && (
          <form onSubmit={handleAddLecture} className="space-y-2 mb-4">
            <input
              type="text"
              placeholder="Lecture Title"
              value={newLecture.title}
              onChange={(e) =>
                setNewLecture({ ...newLecture, title: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              placeholder="Lecture Description"
              value={newLecture.description}
              onChange={(e) =>
                setNewLecture({ ...newLecture, description: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="file"
              accept="video/*"
              onChange={(e) =>
                setNewLecture({ ...newLecture, video: e.target.files[0] })
              }
              className="w-full p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Upload Lecture
            </button>
          </form>
        )}

        {lectures.length === 0 ? (
          <div className="p-4 text-gray-500">
            No lectures available yet
            {user?.role === "admin" && ", click “Add Lecture” to create one"}
          </div>
        ) : (
          lectures.map((lec) => (
            <div
              key={lec._id}
              className={`flex justify-between items-center p-3 rounded cursor-pointer ${
                currentLecture?._id === lec._id
                  ? "bg-blue-100"
                  : "hover:bg-gray-100"
              } transition-colors`}
            >
              <button
                onClick={() => fetchLectureDetails(lec._id)}
                className="flex-1 text-left"
              >
                {lec.title}
              </button>
              {user?.role === "admin" && (
                <button
                  onClick={() => handleDelete(lec._id)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  ×
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Video Player */}
      <div className="flex-1 p-4 bg-white">
        {currentLecture ? (
          <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
            <video controls className="w-full h-full">
              <source
                src={buildMediaUrl(currentLecture.video)}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <div className="mt-4">
              <h2 className="text-2xl font-bold">
                {currentLecture.title}
              </h2>
              <p className="text-gray-600 mt-2">
                {currentLecture.description}
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 text-xl">
            {lectures.length > 0
              ? "Select a lecture to begin"
              : "No lectures available"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Lecture;
