import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import AboutUs from "../pages/AboutUs";
import Courses from "../pages/Courses";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Verify from "../pages/Auth/Verify";
import NotFound from "../pages/NotFound"; // For 404 Page
import Account from "../pages/Account";
import { UserData } from "../context/UserContext";

const AppRoutes = () => {
  const {isAuth, user} = UserData()
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/login" element={isAuth?<Home />:<Login />} />
      <Route path="/register" element={isAuth?<Home />:<Register />} />
      <Route path="/verify" element={isAuth?<Home />:<Verify />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/account" element={isAuth ? <Account /> : <Login />} />
      <Route path="*" element={<NotFound />} /> {/* Handle unknown routes */}
    </Routes>
  );
};

export default AppRoutes;
