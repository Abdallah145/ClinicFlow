// eslint-disable-next-line no-unused-vars
import React from "react";
import logo from "../assets/assets_frontend/logo.png";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between p-4 text-lg font-medium py-4 mb-4 ">
      <div className="flex items-center gap-2">
        <img className="h-12 w-12 cursor-pointer" src={logo} alt="Healix Logo" />
        <span className="text-3xl cursor-pointer font-bold tracking-tighter  font-display text-primary">
          Healix
        </span>
      </div>

      <ul className="hidden md:flex items-start gap-4 font-medium ">
        <NavLink to="/">
          <li className="py-1">HOME</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden"/>
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1">ALL DOCTORS</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden"/>
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">ABOUT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden"/>
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">CONTACT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden"/>
        </NavLink>
      </ul>
      <div className=" md:flex items-center gap-4">
      <button onClick={() => navigate("/login")} className="bg-[#0451c5] text-white px-7 py-2.5 text-sm font-medium rounded-full hover:bg-[#003580] hidden md:block">
        Create Account
      </button>
      </div>
    </div>
  );
};

export default Navbar;
