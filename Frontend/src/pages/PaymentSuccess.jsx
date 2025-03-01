import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
        <p className="text-gray-600 mt-2">Thank you for enrolling in the course.</p>

        {paymentId ? (
          <div className="mt-4 bg-gray-100 p-4 rounded-md text-left">
            <p className="text-gray-700">
              <span className="font-medium">Transaction ID:</span> {paymentId}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Date:</span> {new Date().toLocaleDateString()}
            </p>
          </div>
        ) : (
          <p className="text-red-500 mt-4">No payment details found.</p>
        )}

        <button
          onClick={() => navigate("/courses")}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition"
        >
          Browse More Courses
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
