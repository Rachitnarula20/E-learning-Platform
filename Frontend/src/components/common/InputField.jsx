import React from "react";

const InputField = ({ label, id, type, placeholder, value, onChange }) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-gray-700">{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
        required
      />
    </div>
  );
};

export default InputField;
