import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { server } from "../main"; // Ensure server is imported

const CourseContext = createContext();

export const CourseContextProvider = ({ children }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [course, setCourse] = useState([])

    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get(`${server}/api/course/all`);
            console.log("Fetched Courses Data:", data.courses);
            setCourses(data.courses || []);
        } catch (error) {
            console.error("Failed to fetch courses:", error);
            setError("Failed to fetch courses. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    async function fetchCourse(id) {
        try {
            const { data } = await axios.get(`${server}/api/course/${id}`);
           setCourse(data.course);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                await fetchCourses();
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
                console.log("Updated Courses State:", courses); // ✅ Debugging
            }
        }
        fetchData();
    }, []);

    // ✅ RETURN THE CONTEXT PROVIDER
    return (
        <CourseContext.Provider value={{ courses, loading, error, fetchCourses, fetchCourse, course }}>
            {children}
        </CourseContext.Provider>
    );
};

// ✅ Export CourseData to access context in other components
export const CourseData = () => useContext(CourseContext);
