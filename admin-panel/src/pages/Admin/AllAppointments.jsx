import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorAvatar = ({ image, name }) => {
  const [imageError, setImageError] = useState(false);

  const firstLetter = name?.charAt(0)?.toUpperCase() || "D";

  return (
    <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center flex-shrink-0">
      {image && !imageError ? (
        <img
          src={image}
          alt={name || "Doctor"}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="text-indigo-600 font-medium">{firstLetter}</span>
      )}
    </div>
  );
};

const AllAppointments = () => {
  const { appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);

  useEffect(() => {
    getAllAppointments();
  }, []);

  return (
    <div className="m-5 w-full">
      <p className="mb-3 text-lg font-medium text-gray-700">
        All Appointments
      </p>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll shadow-sm">
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_2fr_2fr_1fr_1fr_1fr] py-3 px-6 border-b bg-gray-50 text-gray-600 font-medium">
          <p>#</p>
          <p>Patient</p>
          <p>Doctor</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Status</p>
          <p>Action</p>
        </div>

        {appointments.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            No appointments found.
          </div>
        ) : (
          appointments.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-1 gap-3 sm:grid-cols-[0.5fr_2fr_2fr_2fr_1fr_1fr_1fr] sm:gap-0 items-center text-gray-500 py-4 px-6 border-b hover:bg-gray-50 transition-all"
            >
              <p className="hidden sm:block">{index + 1}</p>

              <div>
                <p className="text-gray-800 font-medium">
                  {item.patientName || "Patient"}
                </p>

                <p className="text-xs text-gray-400 break-all">
                  {item.patientEmail || item.patientId || "No patient data"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <DoctorAvatar
                  image={item.doctorImage}
                  name={item.doctorName}
                />

                <div>
                  <p className="text-gray-800 font-medium">
                    {item.doctorName || "Doctor"}
                  </p>

                  <p className="text-xs text-gray-400">
                    {item.doctorSpeciality || "No speciality"}
                  </p>
                </div>
              </div>

              <div>
                <p>{item.appointmentDate || "-"}</p>

                <p className="text-xs text-gray-400">
                  {item.appointmentTime || ""}
                </p>
              </div>

              <p className="font-medium text-gray-700">
                ${item.fees ?? 0}
              </p>

              <p
                className={`capitalize font-medium ${
                  item.status === "cancelled"
                    ? "text-red-500"
                    : item.status === "confirmed"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {item.status || "pending"}
              </p>

              <div>
                {item.status === "cancelled" ? (
                  <p className="text-red-400 text-xs font-medium">
                    Cancelled
                  </p>
                ) : (
                  <button
                    onClick={() => cancelAppointment(item.id)}
                    className="text-red-500 border border-red-200 px-3 py-1.5 rounded-full text-xs hover:bg-red-50 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllAppointments;