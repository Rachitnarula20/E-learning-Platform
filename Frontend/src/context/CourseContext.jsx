import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { server } from "../main"; // Ensure server is imported

const CourseContext = createContext();

export const CourseContextProvider = ({ children }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function fetchCourses() {
        try {
            setLoading(true);
            setError(null); // Reset error before fetching
            const { data } = await axios.get(`${server}/api/course/all`);
            setCourses(data.courses || []); // Ensure it's an array
        } catch (error) {
            console.error("Error fetching courses:", error);
            setError("Failed to fetch courses. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (courses.length === 0) fetchCourses(); // ✅ Fetch only if courses are empty
    }, []); 

    return (
        <CourseContext.Provider value={{ courses, fetchCourses, loading, error }}>
            {children}
        </CourseContext.Provider>
    );
};

export const CourseData = () => useContext(CourseContext);
