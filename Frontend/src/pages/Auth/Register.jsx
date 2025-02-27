import React, { useState } from "react";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import {useNavigate } from "react-router-dom"
import { UserData } from "../../context/UserContext";
const Register = () => {

  const navigate = useNavigate()
  const {btnloading, registerUser } = UserData();

  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [name, setName] = useState("")

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("Login button clicked");  // Debug log
    console.log("Email:", email, "Password:", password);
  
    await registerUser(name, email, password, navigate);
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full border">
        <h2 className="text-2xl font-bold text-black">Register</h2>
        <p className="text-gray-500 mb-6">
          Create an account by entering your details below
        </p>

        <form className="space-y-4" onSubmit={submitHandler}>
          <InputField label="Name" id="name" type="text" placeholder="John Doe" value={name} onChange={e=>setName(e.target.value)} />
          <InputField label="Email" id="email" type="email" placeholder="m@example.com" value={email} onChange={e=>setemail(e.target.value)} />
          <InputField label="Password" id="password" type="password" value={password} onChange={e=>setpassword(e.target.value)}/>

          <Button type="submit" disabled={btnloading} >{btnloading? "Please wait" : "Register"} </Button>
        </form>

        {/* Login Link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-700">
            Have an account?{" "}
            <a href="/login" className="text-purple-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
