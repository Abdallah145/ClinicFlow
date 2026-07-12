// eslint-disable-next-line no-unused-vars
import React from 'react'
import {  assets } from "../assets/assets_frontend/assets";



const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* 1. Centered Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          About <span className="text-blue-600">Us</span>
        </h1>
        <p className="mt-6 text-lg text-gray-500 leading-relaxed">
          Welcome to Healix, your trusted partner in managing your healthcare needs conveniently and efficiently. 
          We understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
        </p>
      </div>

      {/* 2. Story & Vision Section (Flipped Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
        {/* Text Content (Left) */}
        <div className="order-2 lg:order-1 space-y-8">
          <p className="text-lg text-gray-600 leading-relaxed">
            Healix is committed to excellence in healthcare technology. We continuously strive to enhance our platform, 
            integrating the latest advancements to improve user experience and deliver superior service. Whether you're 
            booking your first appointment or managing ongoing care, Healix is here to support you every step of the way.
          </p>
          
          {/* Vision Callout Box */}
          <div className="bg-blue-50 border-l-4 border-blue-600 rounded-r-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Our Vision</h3>
            <p className="text-gray-700 italic">
              "Our vision at Healix is to create a seamless healthcare experience for every user. We aim to bridge the gap 
              between patients and healthcare providers, making it easier for you to access the care you need, when you need it."
            </p>
          </div>
        </div>

        {/* Image (Right) */}
        <div className="order-1 lg:order-2 relative">
          <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl">
            {/* Updated image source */}
            <img 
              src={assets.about_image} 
              alt="Healix Doctors" 
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
            />
          </div>
          {/* Decorative background blob/shape */}
          <div className="absolute -z-10 top-8 -right-8 w-full h-full bg-blue-100 rounded-2xl"></div>
        </div>
      </div>

      {/* 3. Why Choose Us Section (Modern Cards) */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 uppercase tracking-wide">
          Why Choose Us
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Efficiency</h3>
            <p className="text-gray-600">
              Streamlined appointment scheduling that fits into your busy lifestyle.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Convenience</h3>
            <p className="text-gray-600">
              Access to a network of trusted healthcare professionals in your area.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Personalization</h3>
            <p className="text-gray-600">
              Tailored recommendations and reminders to help you stay on top of your health.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default About;