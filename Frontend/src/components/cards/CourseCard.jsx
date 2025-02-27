import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ title, description, image }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img
        src={image || "/placeholder.svg"}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600">{description}</p>
        <Link
          to={`/courses/${title.toLowerCase().replace(/\s+/g, "-")}`}
          className="block mt-4 border border-blue-600 text-blue-600 px-4 py-2 rounded-md text-center hover:bg-gray-100"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
