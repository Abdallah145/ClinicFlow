/* eslint-disable no-unused-vars */
import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./page/Home.jsx";
import Doctors from "./page/Doctors.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./page/Login.jsx";
import About from "./page/About.jsx";
import Contact from "./page/Contact.jsx";
import MyProfile from "./page/MyProfile.jsx";
import MyAppointments from "./page/MyAppointments.jsx";
import Appointment from "./page/Appointment.jsx";
import Footer from "./components/Footer.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import Unauthorized from "./page/Unauthorized.jsx";

const App = () => {
  return (
    <AuthProvider>
      <div>
      <ToastContainer />
        <div className="mx-4 sm:mx-[10%]">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:speciality" element={<Doctors />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/my-profile"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <MyProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-appointment"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <MyAppointments />
                </ProtectedRoute>
              }
            />

            <Route
              path="/appointment/:docId"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <Appointment />
                </ProtectedRoute>
              }
            />
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Routes>
        </div>
        <div className="bg-gray-100 px-4 sm:py-[0.1%] sm:px-[10%]">
          <Footer />
        </div>
      </div>
    </AuthProvider>
  );
};

export default App;
