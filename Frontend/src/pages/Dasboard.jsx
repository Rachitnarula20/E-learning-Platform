import React, { useEffect, useState } from 'react';
import { CourseData } from '../context/CourseContext';
import { UserData } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { mycourse, fetchMyCourse } = CourseData();
  const { user } = UserData();
  const navigate = useNavigate();
  
  // Admin states
  const [adminStats, setAdminStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user's courses if not admin
  useEffect(() => {
    if (user?.role !== 'admin') {
      fetchMyCourse();
    }
  }, [user?.role, fetchMyCourse]);

  // Fetch admin stats when admin user is detected
  useEffect(() => {
    const abortController = new AbortController();

    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/stats', {
          headers: {
            Authorization: `Bearer ${user?.token}`, 
            'Content-Type': 'application/json'
          }
        });
    
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const textResponse = await response.text();
          throw new Error(`Unexpected response type: ${contentType}. Response: ${textResponse.slice(0, 100)}`);
        }
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch admin statistics');
        }
    
        const data = await response.json();
        setAdminStats(data.stats);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load admin statistics');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchAdminStats();
    }

    return () => abortController.abort();
  }, [user]);

  const renderAdminDashboard = () => (
    <>
      {/* Admin Stats Section */}
      <section className="mb-8">
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Admin Statistics</h2>
          {loading ? (
            <div className="text-center py-4 text-gray-600">
              Loading statistics...
            </div>
          ) : error ? (
            <div className="text-red-500 p-2 rounded bg-red-50">
              Error: {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard label="Total Courses" value={adminStats?.totalCourses} />
              <StatCard label="Total Lectures" value={adminStats?.totalLectures} />
              <StatCard label="Total Users" value={adminStats?.totalUsers} />
            </div>
          )}
        </div>
      </section>

      {/* Admin Actions */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Admin Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ActionButton 
            label="Manage Courses" 
            onClick={() => navigate('/admin/courses')} 
          />
          <ActionButton
            label="Manage Users"
            onClick={() => navigate('/admin/users')}
          />
          <ActionButton
            label="Manage Lectures"
            onClick={() => navigate('/admin/lectures')}
          />
          <ActionButton
            label="View Reports"
            onClick={() => navigate('/admin/reports')}
          />
        </div>
      </section>
    </>
  );

  const renderUserDashboard = () => (
    <>
      {/* User Stats Section */}
      <section className="mb-8">
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Stats</h2>
          <p>Total Enrolled Courses: <span className="font-bold">{mycourse.length}</span></p>
        </div>
      </section>

      {/* User Courses Section */}
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

      {/* User Quick Links */}
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
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">
          {user?.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
        </h1>
        {user?.name && <p className="text-gray-600">Welcome, {user.name}!</p>}
      </header>

      {user?.role === 'admin' ? renderAdminDashboard() : renderUserDashboard()}
    </div>
  );
};

// Helper components
const StatCard = ({ label, value }) => (
  <div className="bg-blue-50 p-4 rounded-lg">
    <h3 className="text-sm font-medium text-blue-600">{label}</h3>
    <p className="mt-2 text-3xl font-bold text-blue-700">{value ?? '-'}</p>
  </div>
);

const ActionButton = ({ label, onClick }) => (
  <button
    className="bg-white shadow-md p-4 rounded-lg hover:shadow-lg transition text-left"
    onClick={onClick}
  >
    <span className="text-base font-medium text-gray-900">{label}</span>
    <span className="block mt-2 text-sm text-blue-600">Go to {label} →</span>
  </button>
);

export default Dashboard;