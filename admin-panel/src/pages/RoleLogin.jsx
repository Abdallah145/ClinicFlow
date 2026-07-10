import React from "react";
import { useNavigate } from "react-router-dom";

const RoleLogin = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex items-center justify-center px-4">
      <div className="w-full max-w-[355px] bg-white border border-gray-200 rounded-xl px-8 py-9 shadow-lg">
        <div className="text-center">
          <h1 className="text-[25px] font-semibold text-[#1f2937]">
            Healix Portal
          </h1>

          <p className="text-sm text-gray-500 mt-5">
            Choose how you want to sign in
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-6">
          <button
            onClick={() => navigate("/admin-login")}
            className="w-full bg-[#5F6FFF] text-white py-3 rounded-md text-base font-medium hover:bg-[#4c5ce6] transition-all"
          >
            Admin Login
          </button>

          <button
            onClick={() => navigate("/doctor-login")}
            className="w-full bg-white border border-[#5F6FFF] text-[#5F6FFF] py-3 rounded-md text-base font-medium hover:bg-[#F2F3FF] transition-all"
          >
            Doctor Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleLogin;