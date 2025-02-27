import React from "react";

const Button = ({ type, children }) => {
  return (
    <button
      type={type}
      className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition"
    >
      {children}
    </button>
  );
};

export default Button;
