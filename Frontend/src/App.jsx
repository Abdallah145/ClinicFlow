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
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import DoctorDashboard from "./views/DoctorDashboard";


const App = () => {
  return (
    <AuthProvider>
      <DoctorDashboard />
    </AuthProvider>
  );
};

export default App;
