import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";
import { FaStar } from "react-icons/fa";

const DoctorCard = ({ item }) => {
  const navigate = useNavigate();

  const doctorSpeciality =
    item.speciality || item.specialty || "General physician";

  const fallbackImage = assets.default_doctor;
const rating = item.rating || 4.8;
const reviews = item.reviews || 120;

const stars = "⭐".repeat(Math.round(rating));

  return (
<div
  onClick={() => {
    // لو الدكتور مش متاح، متفتحش صفحة الحجز
    if (item.available === false) return;

    navigate(`/appointment/${item.id || item._id}`);
    window.scrollTo(0, 0);
  }}
  className={`border border-blue-200 rounded-xl overflow-hidden transition-all duration-300 ${
    item.available === false
      ? "cursor-not-allowed opacity-70"
      : "cursor-pointer hover:shadow-lg hover:-translate-y-1"
  }`}
>
      {/* Doctor Image */}
      <div className="overflow-hidden bg-blue-50">
        <img
          className="w-full h-60 object-cover transition-transform duration-300 hover:scale-105"
          src={item.image || fallbackImage}
          alt={item.name || "Doctor"}
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
        />
      </div>

      {/* Card Body */}
      <div className="p-4">
        {/* Availability */}

        <div
          className={`flex items-center gap-2 text-sm ${
            item.available ? "text-green-500" : "text-red-500"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              item.available ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>

          <span>{item.available ? "Available" : "Unavailable"}</span>
        </div>
                <div className="flex items-center justify-between mt-2">
  <div className="flex items-center gap-1 text-yellow-400">
    {[...Array(5)].map((_, index) => (
      <FaStar key={index} className="text-sm" />
    ))}
  </div>

  <span className="text-sm font-semibold text-gray-600">
    {rating}
    <span className="text-gray-400 text-xs ml-1">
      ({reviews})
    </span>
  </span>
</div>

        {/* Doctor Name */}
        <h3 className="text-gray-900 text-lg font-semibold mt-2">
          {item.name || "Doctor"}
        </h3>

        {/* Speciality */}
        <p className="text-gray-600 text-sm mt-1">
          {doctorSpeciality}
        </p>

        {/* Experience */}
        {item.experience && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">
              Experience:
            </span>

            <span className="text-sm font-semibold text-primary">
              {item.experience}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorCard;