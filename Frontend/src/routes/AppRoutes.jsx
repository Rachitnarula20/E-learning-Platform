import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/home";
import AboutUs from "../pages/AboutUs";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Courses from "../pages/Courses";
import Verify from "../pages/Auth/Verify";
import NotFound from "../pages/NotFound"; // 404 Page
import Account from "../pages/Account";
import { UserData } from "../context/UserContext";
import CourseDescription from "../pages/CourseDescription";
import PaymentSuccess from "../pages/PaymentSuccess";
import Dashboard from "../pages/Dasboard";
import CourseStudy from "../pages/CourseStudy";
import Lecture from "../pages/Lecture";

const AppRoutes = () => {
  const { isAuth, user } = UserData(); // ✅ Use inside function

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/login" element={isAuth ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={isAuth ? <Navigate to="/" /> : <Register />} />
      <Route path="/verify" element={isAuth ? <Navigate to="/" /> : <Verify />} />

      {/* Protected Routes */}
      <Route path="/account" element={isAuth ? <Account /> : <Navigate to="/login" />} />
      <Route path="/courses/:id" element={isAuth ? <CourseDescription /> : <Navigate to="/login" />} />
      <Route path="/payment-success/:paymentId" element={isAuth ? <PaymentSuccess /> : <Navigate to="/login" /> } />
      <Route path="/:id/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/course/study/:id" element={isAuth ? <CourseStudy /> : <Navigate to="/login" />} />
      <Route path="/course/lectures/:id" element={isAuth ? <Lecture /> : <Navigate to="/login" />} />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
