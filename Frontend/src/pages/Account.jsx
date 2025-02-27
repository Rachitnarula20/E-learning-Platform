import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, LayoutDashboard, LogOut } from "lucide-react";
import { UserData } from "../context/UserContext"; // Importing user context
import toast from "react-hot-toast";

const Account = () => {
  const { user, setuser, setisAuth } = UserData(); // Fetch user and auth functions
  const navigate = useNavigate(); // Navigation hook

  if (!user) return <p>Loading...</p>; // Handle loading case

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    setuser(null); // Clear user state
    setisAuth(false); // Set auth to false
    navigate("/login"); // Redirect to login page
    toast.success("Logged Out Successfully")
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 w-80 text-center">
        {/* Profile Header */}
        <h2 className="text-2xl font-bold text-blue-600 mb-5">My Profile</h2>

        {/* Name */}
        <div className="flex items-center justify-center mb-3 space-x-2">
          <User className="w-5 h-5 text-blue-600" />
          <p className="text-lg font-semibold text-gray-800">{user.name}</p>
        </div>

        {/* Email */}
        <div className="flex items-center justify-center mb-5 space-x-2">
          <Mail className="w-5 h-5 text-blue-600" />
          <p className="text-gray-700">{user.email}</p>
        </div>

        {/* Dashboard Button */}
        <Link
          to="/dashboard"
          className="flex items-center justify-center bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 transition w-full mb-3"
        >
          <LayoutDashboard className="w-5 h-5 mr-2" />
          Dashboard
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center bg-red-600 text-white px-5 py-2 rounded-md font-medium hover:bg-red-700 transition w-full"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Account;
