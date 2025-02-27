import React from "react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import AppRoutes from "./routes/AppRoutes";
import Footer from "./components/layout/Footer";
import { UserData } from "./context/UserContext";



const App = () => {
  const {isAuth} = UserData()
  
  return (
    <BrowserRouter>
      <Navbar isAuth = {isAuth} />
      <AppRoutes />
      <Footer />
    </BrowserRouter>
  );
};

export default App;
