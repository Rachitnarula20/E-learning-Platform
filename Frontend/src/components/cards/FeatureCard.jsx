import React from "react";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 text-center">
      <div className="mb-3">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
