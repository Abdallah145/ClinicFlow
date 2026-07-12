// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import logo from "../assets/assets_frontend/logo.png";
import proile_pic from "../assets/assets_frontend/profile_pic.png";
import dropdown_icon from "../assets/assets_frontend/dropdown_icon.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

 const { currentUser, userData } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <div className="flex items-center gap-2 animate-fade-in">
        <img
  onClick={() => navigate("/")}
  className="h-12 w-12 cursor-pointer transition-transform duration-200 hover:rotate-12"
  src={logo}
  alt="Healix Logo"
/>

        <span
          onClick={() => navigate("/")}
          className="text-3xl cursor-pointer font-bold tracking-tighter font-display text-primary hover:text-[#1D4ED8]"
        >
          Healix
        </span>
      </div>

      <ul className="hidden md:flex items-start gap-5 font-semibold">
        <NavLink to="/">
          <li className="py-1">HOME</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>

        <NavLink to="/doctors">
          <li className="py-1">ALL DOCTORS</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>

        <NavLink to="/about">
          <li className="py-1">ABOUT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>

        <NavLink to="/contact">
          <li className="py-1">CONTACT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-4">
        {currentUser ? (
          <div className="flex items-center gap-2 group relative cursor-pointer">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={userData?.image || proile_pic}
              alt="Profile Picture"
            />

            <img className="w-2.5" src={dropdown_icon} alt="Dropdown Icon" />

            <div className="absolute top-full right-0 pt-2 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded p-4 flex flex-col gap-4 shadow-md border border-zinc-200/50">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>

                <p
                  onClick={() => navigate("/my-appointment")}
                  className="hover:text-black cursor-pointer"
                >
                  My Appointments
                </p>

                <p
                  onClick={handleLogout}
                  className="hover:text-red-600 text-red-500 font-medium cursor-pointer border-t border-gray-200 pt-2"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-[#0451c5] animate-fade-in text-white px-7 py-2.5 text-sm font-medium rounded-full hover:bg-[#1D4ED8] hidden md:block cursor-pointer"
          >
            Create Account
          </button>
        )}

        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden cursor-pointer"
          src={assets.menu_icon}
          alt=""
        />

        <div
          className={`${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <div
              onClick={() => {
                navigate("/");
                setShowMenu(false);
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img className="h-10 w-10" src={logo} alt="" />

              <span className="text-2xl font-bold tracking-tighter text-primary">
                Healix
              </span>
            </div>

            <img
              className="w-7 cursor-pointer"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt=""
            />
          </div>

          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              <p className="px-4 py-2 rounded inline-block">HOME</p>
            </NavLink>

            <NavLink onClick={() => setShowMenu(false)} to="/doctors">
              <p className="px-4 py-2 rounded inline-block">ALL DOCTORS</p>
            </NavLink>

            <NavLink onClick={() => setShowMenu(false)} to="/about">
              <p className="px-4 py-2 rounded inline-block">ABOUT</p>
            </NavLink>

            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              <p className="px-4 py-2 rounded inline-block">CONTACT</p>
            </NavLink>

            {currentUser ? (
              <>
                <p
                  onClick={() => {
                    navigate("/my-profile");
                    setShowMenu(false);
                  }}
                  className="mt-4 text-center w-full max-w-xs py-2.5 rounded-full font-semibold cursor-pointer border"
                >
                  My Profile
                </p>

                <p
                  onClick={() => {
                    navigate("/my-appointment");
                    setShowMenu(false);
                  }}
                  className="text-center w-full max-w-xs py-2.5 rounded-full font-semibold cursor-pointer border"
                >
                  My Appointments
                </p>

                <p
                  onClick={handleLogout}
                  className="text-center w-full max-w-xs bg-red-50 text-red-600 py-2.5 rounded-full font-semibold cursor-pointer border border-red-200 mt-2"
                >
                  Logout
                </p>
              </>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  setShowMenu(false);
                }}
                className="bg-[#0451c5] text-white px-8 py-3 rounded-full mt-4"
              >
                Create Account
              </button>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;