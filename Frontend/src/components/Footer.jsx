import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";

const Footer = () => {
  // Helper function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-slate-50 mt-24">
      <div className="md:mx-10 px-6 lg:px-0 pt-16">

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12">

          {/* Left */}
          <div>
            <div className="flex items-center gap-3">
              <img
                className="w-12 h-12"
                src={assets.logo}
                alt="Healix"
              />

              <div>
                <h2 className="text-3xl font-bold text-primary">
                  Healix
                </h2>

                <p className="text-sm text-primary font-medium">
                  Trusted Healthcare Platform 💙
                </p>
              </div>
            </div>

            <p className="text-gray-600 leading-7 max-w-md mt-6">
              Healix connects patients with trusted healthcare professionals
              through a fast, secure, and seamless appointment booking
              experience.
            </p>

            {/* Social */}
            <div className="flex items-center gap-4 mt-8">

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-primary hover:text-white transition"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-primary hover:text-white transition"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-primary hover:text-white transition"
              >
                <FaLinkedinIn />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-primary hover:text-white transition"
              >
                <FaXTwitter />
              </a>

            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6">
              Quick Links
            </h3>

            <ul className="space-y-3 text-gray-600">

              <li className="hover:text-primary cursor-pointer transition">
                Home
              </li>

              <li className="hover:text-primary cursor-pointer transition">
                All Doctors
              </li>

              <li className="hover:text-primary cursor-pointer transition">
                About
              </li>

              <li className="hover:text-primary cursor-pointer transition">
                Contact
              </li>

            </ul>
          </div>

          {/* Contact */}
          <div>

            <h3 className="text-xl font-semibold mb-6">
              Get In Touch
            </h3>

            <div className="space-y-4 text-gray-600">

              <div className="flex items-center gap-3">
                <FiPhone className="text-primary" />
                <span>+20 100 123 4567</span>
              </div>

              <div className="flex items-center gap-3">
                <FiMail className="text-primary" />
                <span>support@healix.com</span>
              </div>

              <div className="flex items-center gap-3">
                <FiMapPin className="text-primary" />
                <span>Cairo, Egypt</span>
              </div>

            </div>

          </div>

        </div>

        <hr className="my-10 border-gray-200" />

        <div className="pb-6 text-center text-gray-500 text-sm">
          © 2026 <span className="font-semibold text-primary">Healix</span>.
          Designed with ❤️ for better healthcare.
        </div>

      </div>
    </footer>
  );
};

export default Footer;