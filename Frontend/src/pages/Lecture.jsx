import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { server } from '../main';
import { UserData } from '../context/UserContext';
import toast from 'react-hot-toast';

const Lecture = () => {
  const { user } = UserData();
  const { id: courseId } = useParams();
  const [lectures, setLectures] = useState([]);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLecture, setNewLecture] = useState({ 
    title: '', 
    description: '', // Add this initial value
    video: null 
  });
  
  const token = localStorage.getItem('token');

  const fetchLectures = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${server}/api/course/lectures/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLectures(data.lectures);
      setError('');
      
      // Auto-select first lecture if available
      if (data.lectures.length > 0) {
        fetchLectureDetails(data.lectures[0]._id);
      }
    } catch (err) {
      setError('Failed to load lectures');
      toast.error('Failed to load lectures');
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
      setError('Failed to load lecture details');
      toast.error('Failed to load lecture details');
    }
  };

  const handleDelete = async (lectureId) => {
    if (!window.confirm('Are you sure you want to delete this lecture?')) return;
    try {
      await axios.delete(`${server}/api/admin/lecture/${lectureId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLectures(prev => prev.filter(l => l._id !== lectureId));
      if (currentLecture?._id === lectureId) setCurrentLecture(null);
      toast.success('Lecture deleted successfully');
    } catch (err) {
      console.error('Delete error:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to delete lecture');
      toast.error(err.response?.data?.message || 'Failed to delete lecture');
    }
  };

  const handleAddLecture = async (e) => {
    e.preventDefault();
  
    // Validate required fields
    if (!newLecture.title || !newLecture.description || !newLecture.video) {
      toast.error('Please provide a title, description, and select a video file');
      return;
    }
  
    const formData = new FormData();
    formData.append('title', newLecture.title);
    formData.append('description', newLecture.description);
    formData.append('video', newLecture.video);
  
    try {
      const { data } = await axios.post(
        `${server}/api/admin/course/${courseId}`,
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setShowAddForm(false);
    setNewLecture({ title: '', description: '', video: null });
      await fetchLectures();
      setCurrentLecture(data.lecture);
      toast.success('Lecture added successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add lecture');
      toast.error('Failed to add lecture');
    }
  };

  useEffect(() => {
    fetchLectures();
  }, [courseId]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-4 text-red-500 text-center">{error}</div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Lecture List Sidebar */}
      <div className="w-full md:w-1/3 bg-gray-50 p-4 border-r">
        <div className="mb-4">
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Add Lecture
            </button>
          )}

          {showAddForm && (
            <form onSubmit={handleAddLecture} className="mt-4 space-y-2">
            <input
              type="text"
              placeholder="Lecture Title"
              value={newLecture.title}
              onChange={(e) => setNewLecture({ ...newLecture, title: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            {/* Add this textarea for description */}
            <textarea
              placeholder="Lecture Description"
              value={newLecture.description}
              onChange={(e) => setNewLecture({ ...newLecture, description: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
             <input
      type="file"
      accept="video/*"
      onChange={(e) => setNewLecture({ ...newLecture, video: e.target.files[0] })}
      className="w-full p-2 border rounded"
      required
    />
              <div className="flex gap-2">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {lectures.length === 0 ? (
          <div className="p-4 text-gray-500">
            No lectures available yet{user?.role === 'admin' && ', click "Add Lecture" to create one'}
          </div>
        ) : (
          <div className="space-y-2">
            {lectures.map(lecture => (
              <div
                key={lecture._id}
                className={`flex justify-between items-center p-3 rounded cursor-pointer ${
                  currentLecture?._id === lecture._id ? 'bg-blue-100' : 'hover:bg-gray-100'
                } transition-colors`}
              >
                <button
                  onClick={() => fetchLectureDetails(lecture._id)}
                  className="text-left flex-1"
                >
                  {lecture.title}
                </button>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => handleDelete(lecture._id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Player Section */}
      <div className="flex-1 p-4 bg-white">
        {currentLecture ? (
          <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
            <video
              controls
              className="w-full h-full"
              key={currentLecture.video}
            >
              <source src={`${server}/${currentLecture.video}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="mt-4">
              <h2 className="text-2xl font-bold">{currentLecture.title}</h2>
              <p className="text-gray-600 mt-2">{currentLecture.description}</p>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 text-xl">
            {lectures.length > 0 ? 'Select a lecture to begin' : 'No lectures available'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Lecture;