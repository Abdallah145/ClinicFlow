import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { auth, db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAppointments = async () => {
    const currentDoctor = auth.currentUser;

    if (!currentDoctor) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // يجيب فقط الحجوزات التي doctorId فيها يساوي UID الدكتور المسجل
      const appointmentsQuery = query(
        collection(db, "appointments"),
        where("doctorId", "==", currentDoctor.uid)
      );

      const snapshot = await getDocs(appointmentsQuery);

      const appointmentsData = snapshot.docs.map((appointmentDoc) => ({
        id: appointmentDoc.id,
        ...appointmentDoc.data(),
      }));

      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Error getting doctor appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      await updateDoc(doc(db, "appointments", appointmentId), {
        status: "cancelled",
        updatedAt: new Date(),
      });

      getAppointments();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      await updateDoc(doc(db, "appointments", appointmentId), {
        status: "completed",
        updatedAt: new Date(),
      });

      getAppointments();
    } catch (error) {
      console.error("Error completing appointment:", error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  return (
    <div className="m-5 w-full">
      <p className="mb-3 text-lg font-medium text-gray-700">
        My Appointments
      </p>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-auto shadow-sm">
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1.5fr_2fr_1fr_1fr_1fr] gap-2 py-3 px-6 border-b bg-gray-50 text-gray-600 font-medium">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Status</p>
          <p>Action</p>
        </div>

        {loading ? (
          <p className="text-center py-10 text-gray-400">
            Loading appointments...
          </p>
        ) : appointments.length === 0 ? (
          <p className="text-center py-10 text-gray-400">
            No appointments found.
          </p>
        ) : (
          appointments.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-1 gap-3 sm:grid-cols-[0.5fr_2fr_1.5fr_2fr_1fr_1fr_1fr] sm:gap-2 items-center text-gray-500 py-4 px-6 border-b hover:bg-gray-50 transition-all"
            >
              <p className="hidden sm:block">{index + 1}</p>

              <div>
                <p className="text-gray-800 font-medium">
                  {item.patientName || "Patient"}
                </p>

                <p className="text-xs text-gray-400 break-all">
                  {item.patientId || ""}
                </p>
              </div>

              <div>
                <p className="text-xs inline border border-[#5F6FFF] px-2 py-0.5 rounded-full text-[#5F6FFF]">
                  {item.paymentStatus === "paid" ? "Online" : "CASH"}
                </p>
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
                    : item.status === "completed"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {item.status || "pending"}
              </p>

              <div>
                {item.status === "cancelled" ? (
                  <p className="text-red-400 text-xs font-semibold">
                    Cancelled
                  </p>
                ) : item.status === "completed" ? (
                  <p className="text-green-500 text-xs font-semibold">
                    Completed
                  </p>
                ) : (
                  <div className="flex items-center gap-2">
                    <img
                      onClick={() => cancelAppointment(item.id)}
                      className="w-8 cursor-pointer p-1.5 hover:bg-red-50 rounded-full transition-all"
                      src={assets.cancel_icon}
                      alt="Cancel"
                    />

                    <img
                      onClick={() => completeAppointment(item.id)}
                      className="w-8 cursor-pointer p-1.5 hover:bg-green-50 rounded-full transition-all"
                      src={assets.tick_icon}
                      alt="Complete"
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;