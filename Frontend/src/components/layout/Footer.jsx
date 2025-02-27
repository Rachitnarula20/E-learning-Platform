import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          {/* Brand Info */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">E-Learning Platform</h3>
            <p className="text-sm">Empowering learners worldwide.</p>
          </div>

          {/* Quick Links */}
<div className="w-full md:w-1/4 mb-6 md:mb-0">
  <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
  <ul className="text-sm flex space-x-6">
    <li>
      <Link to="/about" className="hover:text-blue-400">
        About Us
      </Link>
    </li>
    <li>
      <Link to="/courses" className="hover:text-blue-400">
        Courses
      </Link>
    </li>
    <li>
      <Link to="/contact" className="hover:text-blue-400">
        Contact
      </Link>
    </li>
  </ul>
</div>


          {/* Social Media */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://github.com/Rachitnarula20" target="blank" className="hover:text-blue-400">
                Github
              </a>
              <a href="#" className="hover:text-blue-400">
                Instagram
              </a>
              <a href="https://www.linkedin.com/in/rachit-narula/" target="blank" className="hover:text-blue-400">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} E-Learning Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
