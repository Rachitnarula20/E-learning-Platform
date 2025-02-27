import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { server } from "../main";
import toast, { Toaster } from "react-hot-toast";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, setuser] = useState(null);
    const [isAuth, setisAuth] = useState(false);
    const [btnloading, setbtnloading] = useState(false);
    const [loading, setloading] = useState(true);

    async function loginUser(email, password, navigate) {
        setbtnloading(true);
        try {
            const { data } = await axios.post(`${server}/api/user/login`, {
                email,
                password,
            });

            toast.success(data.message);
            localStorage.setItem("token", data.token);

            setuser(data.user);
            setisAuth(true);
            setbtnloading(false);
            navigate("/");
        } catch (error) {
            setbtnloading(false);
            setisAuth(false);
            toast.error(error.response?.data?.message || "Login failed");
        }
    }

    async function registerUser(name, email, password, navigate) {
        setbtnloading(true);
        try {
            const { data } = await axios.post(`${server}/api/user/register`, {
                name,
                email,
                password,
            });

            toast.success(data.message);
            localStorage.setItem("activationToken", data.activationToken);
            setbtnloading(false);
            navigate("/verify");
        } catch (error) {
            setbtnloading(false);
            toast.error(error.response?.data?.message || "Login failed");
        }
    }

    
    async function verifyOtp(otp, navigate) {
        setbtnloading(true)
        const activationToken = localStorage.getItem("activationToken");
        try {
            const { data } = await axios.post(`${server}/api/user/verify`, {
                otp,
                activationToken,
            });

            toast.success(data.message); 
            navigate('/login');
            localStorage.clear();
            setbtnloading(false)
        } catch (error) {
            toast.error(error.response.data.message)
            setbtnloading(false)
        }
    }

    async function fetchUser() {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.log("No token found in LocalStorage!");
                setloading(false);
                return;
            }

            console.log("Fetching user with token:", token);

            const { data } = await axios.get(`${server}/api/user/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("User fetched successfully:", data);
            setisAuth(true);
            setuser(data.user);
        } catch (error) {
            console.error("Error fetching user:", error.response?.data || error.message);
        } finally {
            setloading(false);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setuser, setisAuth, isAuth, loginUser, btnloading, loading, registerUser,verifyOtp }}>
            {children}
            <Toaster />
        </UserContext.Provider>
    );
};

// ✅ Ensure this export is AFTER defining `UserContext`
export const UserData = () => useContext(UserContext);
