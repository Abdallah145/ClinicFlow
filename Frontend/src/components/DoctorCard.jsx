import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";

const DoctorCard = ({ item }) => {
  const navigate = useNavigate();

  const doctorSpecialty = item.specialty || item.speciality || "General physician";



const fallbackImage = assets.default_doctor;

  return (
    <div 
    onClick={() => {
        navigate(`/appointment/${item.id || item._id}`);
        window.scrollTo(0, 0);
    }} 
    className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer transition-all duration-500'
>
      <img
        className="w-full h-52 object-cover bg-blue-50"
        src={item.image || fallbackImage}
        alt={item.name || "Doctor"}
        onError={(event) => {
          event.currentTarget.src = fallbackImage;
        }}
      />

      <div className="p-4">
        <div
          className={`flex items-center gap-2 text-sm ${
            item.available ? "text-green-500" : "text-gray-500"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              item.available ? "bg-green-500" : "bg-gray-500"
            }`}
          />
          <span>{item.available ? "Available" : "Not Available"}</span>
        </div>

        <p className="text-gray-900 text-lg font-medium mt-2">
          {item.name || "Doctor"}
        </p>

        <p className="text-gray-600 text-sm mt-1">{doctorSpecialty}</p>

        {item.degree && (
          <p className="text-gray-500 text-xs mt-1">{item.degree}</p>
        )}

        {item.experience && (
          <p className="text-gray-500 text-xs mt-1">
            {item.experience} Experience
          </p>
        )}
      </div>
    </div>
  );
};

export default DoctorCard;