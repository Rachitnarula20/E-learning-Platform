import React, { useState } from "react";
import InputField from "../../components/common/InputField.jsx";
import Button from "../../components/common/Button.jsx";
import { UserData } from "../../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate()
  const {btnloading, loginUser } = UserData();

  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("Login button clicked");  // Debug log
    console.log("Email:", email, "Password:", password);
  
    await loginUser(email, password, navigate);
  };
  


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full border">
        <h2 className="text-2xl font-bold text-black">Login</h2>
        <p className="text-gray-500 mb-6">
          Enter your email and password to login to your account
        </p>  

        <form className="space-y-4" onSubmit={submitHandler}>
          <InputField label="Email" id="email" type="email" placeholder="m@example.com" value={email} onChange={e=>setemail(e.target.value)}/>
          <InputField label="Password" id="password" type="password" value={password} onChange={e=>setpassword(e.target.value)} />

          <Button disabled={btnloading} type="submit">{btnloading? "Please wait..." : "Login"}</Button>
        </form>

        {/* Register Link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-700">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-purple-600 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
