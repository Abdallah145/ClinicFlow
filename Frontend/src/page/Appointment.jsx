import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { assets } from "../assets/assets_frontend/assets";
import { AppContext } from "../context/AppContext";
import RelatedDoctors from "../components/RelatedDoctors";
import { auth, db } from "../firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

// Core Structural Plumbing Imports
import { useAuth } from '../context/AuthContext';       // Pulls active user login token
import { bookAppointment } from '../clinicService';     // Pulls your transaction code

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext);

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [booking, setBooking] = useState(false);

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  useEffect(() => {
    const selectedDoctor = doctors.find(
      (doctor) => doctor.id === docId || doctor._id === docId
    );

    setDocInfo(selectedDoctor || null);
  }, [docId, doctors]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  const getAvailableSlots = () => {
    const allSlots = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const slotDate = new Date(today);
      slotDate.setDate(today.getDate() + i);

      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (i === 0) {
        const currentHour = currentDate.getHours();

        currentDate.setHours(currentHour >= 10 ? currentHour + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
        currentDate.setSeconds(0);
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }

      const timeSlots = [];

      while (currentDate < endTime) {
        timeSlots.push({
          datetime: new Date(currentDate),
          time: currentDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      allSlots.push({
        day: daysOfWeek[slotDate.getDay()],
        date: slotDate.getDate(),
        dateLabel: slotDate.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        slots: timeSlots,
      });
    }

    setDocSlots(allSlots);
    setSlotIndex(0);
    setSlotTime("");
  };

const handleBookAppointment = async () => {
  const user = auth.currentUser;
  const selectedDate = docSlots[slotIndex]?.dateLabel;

  // Prevent booking unavailable doctors
  if (docInfo?.available === false) {
    toast.error("This doctor is currently unavailable.");
    return;
  }

    if (!user) {
      toast.error("Please login first to book an appointment");
      navigate("/login");
      return;
    }

    if (!slotTime) {
      toast.warn("Please select a time slot before booking.");
      return;
    }

    if (!selectedDate) {
      toast.warn("Please select a date before booking.");
      return;
    }

    setBooking(true);

    try {
      const doctorId = docInfo.uid || docInfo.id || docInfo._id;

      // نجيب بيانات المريض من users collection
      const patientDoc = await getDoc(doc(db, "users", user.uid));

      const patientData = patientDoc.exists() ? patientDoc.data() : {};

      await addDoc(collection(db, "appointments"), {
        patientId: user.uid,
        patientName: patientData.name || user.displayName || "Patient",
        patientEmail: patientData.email || user.email || "",
        patientPhone: patientData.phone || "",
        patientImage: patientData.image || "",

        doctorId: doctorId,
        doctorName: docInfo.name || "",
        doctorSpeciality: docInfo.specialty || docInfo.speciality || "",
        doctorImage: docInfo.image || "",

        doctorAddress: docInfo.address || {
          line1: "",
          line2: "",
        },

        appointmentDate: selectedDate,
        appointmentTime: slotTime,

        fees: Number(docInfo.fees || 0),
        status: "pending",
        paymentStatus: "unpaid",

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success("Appointment booked successfully");

      setTimeout(() => {
        navigate("/my-appointment");
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error("Could not book appointment: " + error.message);
    } finally {
      setBooking(false);
    }
  };

  if (!docInfo) {
    return (
      <div className="flex justify-center my-20">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const speciality = docInfo.specialty || docInfo.speciality || "";
  const doctorId = docInfo.uid || docInfo.id || docInfo._id;

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img
            className="bg-primary w-full sm:max-w-72 rounded-lg"
            src={docInfo.image}
            alt={docInfo.name}
          />
        </div>

        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
            {docInfo.name}
            <img className="w-5" src={assets.verified_icon} alt="Verified" />
          </p>

          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
            <p>
              {docInfo.degree || "Doctor"} - {speciality}
            </p>

            <button className="py-0.5 px-2 border text-xs rounded-full">
              {docInfo.experience || "Experience not specified"}
            </button>
          </div>

          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
              About <img src={assets.info_icon} alt="Info" />
            </p>

            <p className="text-sm text-gray-500 max-w-[700px] mt-1">
              {docInfo.about || "No information available about this doctor."}
            </p>
          </div>

          <p className="text-gray-500 font-medium mt-4">
            Appointment fee:{" "}
            <span className="text-gray-900">${docInfo.fees || 0}</span>
          </p>
        </div>
      </div>

<div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
  {docInfo.available === false ? (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
      <p className="text-red-600 text-lg font-semibold">
        Doctor Currently Unavailable
      </p>

      <p className="text-gray-500 text-sm mt-2">
        This doctor is currently not accepting new appointments.
        Please choose another available doctor.
      </p>

      <button
        onClick={() => {
          navigate("/doctors");
          window.scrollTo(0, 0);
        }}
        className="mt-4 bg-primary text-white px-6 py-2.5 rounded-full text-sm hover:opacity-90 transition-all"
      >
        View Available Doctors
      </button>
    </div>
  ) : (
    <>
      <p>Booking slots</p>

      {/* Days */}
      <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
        {docSlots.map((item, index) => (
          <div
            key={item.dateLabel}
            onClick={() => {
              setSlotIndex(index);
              setSlotTime("");
            }}
            className={`text-center py-6 min-w-16 rounded-full cursor-pointer transition-all ${
              slotIndex === index
                ? "bg-primary text-white"
                : "border border-gray-200"
            }`}
          >
            <p>{item.day}</p>
            <p>{item.date}</p>
          </div>
        ))}
      </div>

      {/* Times */}
      <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
        {docSlots[slotIndex]?.slots.map((item) => (
          <p
            key={item.time}
            onClick={() => setSlotTime(item.time)}
            className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer transition-all ${
              item.time === slotTime
                ? "bg-primary text-white"
                : "text-gray-400 border border-gray-300"
            }`}
          >
            {item.time.toLowerCase()}
          </p>
        ))}
      </div>

      {/* Booking Button */}
      <button
        onClick={handleBookAppointment}
        disabled={booking}
        className="bg-primary cursor-pointer text-white text-sm font-light px-14 py-3 rounded-full mt-6 hover:opacity-90 disabled:opacity-60"
      >
        {booking ? "Booking..." : "Book an appointment"}
      </button>
    </>
  )}
</div>

      <RelatedDoctors docId={doctorId} speciality={speciality} />
    </div>
  );
};

export default Appointment;