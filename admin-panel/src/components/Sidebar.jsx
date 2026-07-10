import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { userRole, loading } = useAuth();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 py-3.5 px-6 md:px-9 md:min-w-72 cursor-pointer transition-all ${
      isActive
        ? "bg-[#F2F3FF] border-r-4 border-[#5F6FFF]"
        : "hover:bg-gray-50"
    }`;

  if (loading || !userRole) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white border-r border-gray-100">
      {/* Admin Sidebar */}
      {userRole === "admin" && (
        <ul className="text-[#515151] mt-5">
          <NavLink to="/admin-dashboard" className={linkClass}>
            <img className="w-5" src={assets.home_icon} alt="" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>

          <NavLink to="/all-appointments" className={linkClass}>
            <img className="w-5" src={assets.appointment_icon} alt="" />
            <p className="hidden md:block">Appointments</p>
          </NavLink>

          <NavLink to="/add-doctor" className={linkClass}>
            <img className="w-5" src={assets.add_icon} alt="" />
            <p className="hidden md:block">Add Doctor</p>
          </NavLink>

          <NavLink to="/doctor-list" className={linkClass}>
            <img className="w-5" src={assets.people_icon} alt="" />
            <p className="hidden md:block">Doctors List</p>
          </NavLink>
        </ul>
      )}

      {/* Doctor Sidebar */}
      {userRole === "doctor" && (
        <ul className="text-[#515151] mt-5">
          <NavLink to="/doctor-dashboard" className={linkClass}>
            <img className="w-5" src={assets.home_icon} alt="" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>

          <NavLink to="/doctor-appointments" className={linkClass}>
            <img className="w-5" src={assets.appointment_icon} alt="" />
            <p className="hidden md:block">Appointments</p>
          </NavLink>

          <NavLink to="/doctor-profile" className={linkClass}>
            <img className="w-5" src={assets.people_icon} alt="" />
            <p className="hidden md:block">Profile</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;