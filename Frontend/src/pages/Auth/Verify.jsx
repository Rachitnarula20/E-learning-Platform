import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";

const Verify = () => {
  const [otp, setOtp] = useState(""); // Single input field for OTP
  const { btnloading, verifyOtp } = UserData();
  const navigate = useNavigate();

  // Handle OTP input change
  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    setOtp(value);
  };

  // Submit OTP for verification
  const submitHandler = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }
    await verifyOtp(Number(otp), navigate);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 px-4 py-12">
      <div className="mx-auto w-full max-w-md space-y-6 bg-white shadow-lg rounded-lg p-6 border">
        <h2 className="text-2xl font-bold text-black">Verify your email</h2>
        <p className="text-gray-500">
          Enter the 6-digit code sent to your email address to verify your account.
        </p>

        {/* OTP Form */}
        <form className="space-y-4" onSubmit={submitHandler}>
          <input
            type="text"
            value={otp}
            maxLength="6"
            onChange={handleChange}
            placeholder="Enter OTP"
            className="w-full text-center text-xl border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-black focus:border-black"
          />

          {/* Verify Button */}
          <button
            disabled={btnloading}
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition"
          >
            {btnloading ? "Please Wait" : "Verify"}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-700">
            Go to{" "}
            <Link to="/login" className="text-purple-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verify;
