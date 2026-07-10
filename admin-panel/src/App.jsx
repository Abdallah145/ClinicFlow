import React from "react";
import "./App.css";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";

import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import DoctorProfile from "./pages/Doctor/DoctorProfile";

import AdminLogin from "./pages/AdminLogin";
import DoctorLogin from "./pages/DoctorLogin";
import RoleLogin from "./pages/RoleLogin";

import { useAuth } from "./context/AuthContext";

function App() {
  const location = useLocation();
  const { currentUser, userRole, loading } = useAuth();

  const isLoginPage =
    location.pathname === "/login" ||
    location.pathname === "/admin-login" ||
    location.pathname === "/doctor-login";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // لو مش عامل Login، يرجع لصفحة اختيار Admin أو Doctor
  if (!currentUser && !isLoginPage) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="bg-[#F8F9FD] min-h-screen">
      {!isLoginPage && <Navbar />}

      <ToastContainer />

      {isLoginPage ? (
        <Routes>
          <Route path="/login" element={<RoleLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <div className="flex items-start">
          <Sidebar />

          <main className="flex-1 p-5">
            <Routes>
              <Route
                path="/"
                element={
                  userRole === "admin" ? (
                    <Navigate to="/admin-dashboard" replace />
                  ) : (
                    <Navigate to="/doctor-dashboard" replace />
                  )
                }
              />

              <Route
                path="/admin-dashboard"
                element={
                  userRole === "admin" ? (
                    <Dashboard />
                  ) : (
                    <Navigate to="/doctor-dashboard" replace />
                  )
                }
              />

              <Route
                path="/all-appointments"
                element={
                  userRole === "admin" ? (
                    <AllAppointments />
                  ) : (
                    <Navigate to="/doctor-dashboard" replace />
                  )
                }
              />

              <Route
                path="/add-doctor"
                element={
                  userRole === "admin" ? (
                    <AddDoctor />
                  ) : (
                    <Navigate to="/doctor-dashboard" replace />
                  )
                }
              />

              <Route
                path="/doctor-list"
                element={
                  userRole === "admin" ? (
                    <DoctorsList />
                  ) : (
                    <Navigate to="/doctor-dashboard" replace />
                  )
                }
              />

              <Route
                path="/doctor-dashboard"
                element={
                  userRole === "doctor" ? (
                    <DoctorDashboard />
                  ) : (
                    <Navigate to="/admin-dashboard" replace />
                  )
                }
              />

              <Route
                path="/doctor-appointments"
                element={
                  userRole === "doctor" ? (
                    <DoctorAppointments />
                  ) : (
                    <Navigate to="/admin-dashboard" replace />
                  )
                }
              />

              <Route
                path="/doctor-profile"
                element={
                  userRole === "doctor" ? (
                    <DoctorProfile />
                  ) : (
                    <Navigate to="/admin-dashboard" replace />
                  )
                }
              />

              <Route
                path="*"
                element={
                  <Navigate
                    to={
                      userRole === "admin"
                        ? "/admin-dashboard"
                        : "/doctor-dashboard"
                    }
                    replace
                  />
                }
              />
            </Routes>
          </main>
        </div>
      )}
    </div>
  );
}

export default App;