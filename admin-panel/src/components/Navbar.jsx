import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { assets } from "../assets/assets";

const Navbar = () => {
  const { userRole, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage =
    location.pathname === "/login" ||
    location.pathname === "/admin-login" ||
    location.pathname === "/doctor-login";

  if (isLoginPage || loading) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);

      // بعد Logout يرجع لاختيار نوع الحساب
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const roleLabel =
    userRole === "admin"
      ? "Admin"
      : userRole === "doctor"
      ? "Doctor"
      : "User";

  return (
    <div className="flex items-center justify-between px-4 sm:px-10 py-3 border-b bg-white">
      <div className="flex items-center gap-3">
        <img
          className="w-36 sm:w-40 cursor-pointer"
          src={assets.admin_logo}
          alt="Healix"
          onClick={() =>
            navigate(
              userRole === "admin"
                ? "/admin-dashboard"
                : "/doctor-dashboard"
            )
          }
        />

        <p className="border px-2.5 py-0.5 rounded-full text-xs text-gray-600">
          {roleLabel}
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="bg-[#5F6FFF] text-white text-sm px-6 py-2 rounded-full hover:bg-[#4c5ce6] transition-all"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;