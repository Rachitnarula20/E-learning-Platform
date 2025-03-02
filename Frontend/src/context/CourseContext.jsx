import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { server } from "../main"; // Ensure server is imported

const CourseContext = createContext();

export const CourseContextProvider = ({ children }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [course, setCourse] = useState(null);
    const [mycourse, setMyCourse] = useState([]);

    // ✅ Fetch all courses
    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get(`${server}/api/course/all`);
            setCourses(data.courses || []);
        } catch (error) {
            console.error("❌ Failed to fetch courses:", error);
            setError("Failed to fetch courses. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Fetch single course by ID
    const fetchCourse = async (id) => {
        try {
            const { data } = await axios.get(`${server}/api/course/${id}`);
            setCourse(data.course);
        } catch (error) {
            console.error(`❌ Failed to fetch course (ID: ${id}):`, error);
            setError("Failed to load course details.");
        }
    };

    // ✅ Fetch User's Subscribed Courses
    async function fetchMyCourse() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found in localStorage");
                return;
            }
    
            const { data } = await axios.get(`${server}/api/course/mycourse`, {
                headers: {
                    Authorization: `Bearer ${token}`, // ✅ Fix: Use "Bearer" prefix
                },
            });
    
            console.log("Fetched My Courses Data:", data.courses);
            setMyCourse(data.courses);
        } catch (error) {
            console.error("Error fetching my courses:", error);
        }
    }
    
    
    
    // ✅ Run once on mount
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                await fetchCourses();
                await fetchMyCourse(); // Ensure this is awaited ✅
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
                console.log("Updated Courses State:", courses); // ✅ Debugging
                console.log("Updated My Courses State:", mycourse); // ✅ Debugging
            }
        }
        fetchData();
    }, []);
    

    return (
        <CourseContext.Provider value={{ 
            courses, 
            course, 
            mycourse, 
            loading, 
            error, 
            fetchCourses, 
            fetchCourse, 
            fetchMyCourse 
        }}>
            {children}
        </CourseContext.Provider>
    );
};

// ✅ Export Hook for Accessing Context
export const CourseData = () => useContext(CourseContext);
