import React from "react";
import { assets } from "../assets/assets_frontend/assets";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className="flex bg-primary rounded-2xl overflow-hidden my-20 md:mx-10">

      {/* Left Side */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-10 lg:py-16">

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
          Book Appointment
          <br />
          With 100+ Trusted Doctors
        </h2>

        <button
          onClick={() => {
            navigate("/doctors");
            window.scrollTo(0, 0);
          }}
          className="bg-white text-primary font-semibold px-8 py-3 rounded-full w-fit mt-8 hover:scale-105 transition-all duration-300"
        >
          Book Appointment
        </button>

      </div>

      {/* Right Side */}
      <div className="hidden md:block w-[38%] relative overflow-hidden">

        <img
          src={assets.unnamed}
          alt="Appointment"
          className="absolute inset-0 w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
        />

        {/* Overlay بسيط يخلي الصورة متناسقة مع الأزرق */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-primary/10"></div>

      </div>

    </div>
  );
};

export default Banner;