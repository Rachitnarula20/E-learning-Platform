import React, { useEffect } from 'react';
import { CourseData } from '../context/CourseContext';
import { UserData } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { mycourse, fetchMyCourse } = CourseData();
  const { user } = UserData();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyCourse(); // Fetch enrolled courses on mount
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        {user?.name && <p className="text-gray-600">Welcome, {user.name}!</p>}
      </header>

      {/* Stats Section */}
      <section className="mb-8">
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Stats</h2>
          <p>Total Enrolled Courses: <span className="font-bold">{mycourse.length}</span></p>
        </div>
      </section>

      {/* My Courses Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">My Courses</h2>
        {mycourse.length === 0 ? (
          <p className="text-gray-600">You have not enrolled in any courses yet.</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {mycourse.map(course => (
              <div key={course._id} className="bg-white rounded shadow p-4 hover:shadow-lg transition">
                <h3 className="text-base font-bold mb-1">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{course.category}</p>
                <p className="text-sm">Duration: {course.duration} hrs</p>
                <p className="text-sm mb-4">Price: ₹{course.price}</p>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  onClick={() => navigate(`/course/study/${course._id}`)}
                >
                  Continue Learning
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick Links */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
        <div className="flex flex-wrap gap-4">
          <button
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
            onClick={() => navigate('/account')}
          >
            Account Settings
          </button>
          <button
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
            onClick={() => navigate('/courses')}
          >
            Browse Courses
          </button>
          <button
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
            onClick={() => navigate('/logout')}
          >
            Logout
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
