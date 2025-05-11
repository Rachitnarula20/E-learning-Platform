import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// ✅ Ensure correct import path
import { UserContextProvider } from "./context/UserContext.jsx";
import { CourseContextProvider } from "./context/CourseContext.jsx";

export const server = "https://e-learning-platform-rnec.onrender.com";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserContextProvider>
      <CourseContextProvider>
        <App /> 
      </CourseContextProvider>
    </UserContextProvider>
  </StrictMode>
);
