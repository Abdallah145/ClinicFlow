import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import {
  collection,
  getDocs,
  orderBy,
  query,
  limit,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

const Dashboard = () => {
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getDashData = async () => {
    try {
      setLoading(true);

      // نجيب كل users
      const usersSnapshot = await getDocs(collection(db, "users"));

      const users = usersSnapshot.docs.map((userDoc) => ({
        id: userDoc.id,
        ...userDoc.data(),
      }));

      // نجيب كل appointments
      const appointmentsSnapshot = await getDocs(
        collection(db, "appointments")
      );

      const appointments = appointmentsSnapshot.docs.map(
        (appointmentDoc) => ({
          id: appointmentDoc.id,
          ...appointmentDoc.data(),
        })
      );

      // عدد الدكاترة
      const doctorsCount = users.filter(
        (user) => user.role === "doctor"
      ).length;

      // عدد المرضى
      const patientsCount = users.filter(
        (user) => user.role === "patient"
      ).length;

      const pendingAppointments = appointments.filter(
        (appointment) => appointment.status !== "completed" && appointment.status !== "cancelled"
      );

      // ترتيب آخر الحجوزات حسب createdAt
      const latestAppointments = [...pendingAppointments]
        .sort((a, b) => {
          const dateA = a.createdAt?.toDate
            ? a.createdAt.toDate()
            : new Date(0);

          const dateB = b.createdAt?.toDate
            ? b.createdAt.toDate()
            : new Date(0);

          return dateB - dateA;
        })
        .slice(0, 5);

      setDashData({
        doctors: doctorsCount,
        patients: patientsCount,
        appointments: appointments.length,
        latestAppointments,
      });
    } catch (error) {
      console.error("Dashboard error:", error);
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

      getDashData();
    } catch (error) {
      console.error("Cancel appointment error:", error);
    }
  };

  useEffect(() => {
    getDashData();
  }, []);

  if (loading) {
    return <div className="m-5 w-full">Loading dashboard...</div>;
  }

  return (
    <div className="m-5 w-full">
      <div className="flex flex-wrap gap-5">
        <div className="flex items-center gap-4 bg-white p-6 min-w-64 rounded-lg border border-gray-100 shadow-sm">
          <img className="w-14" src={assets.doctor_icon} alt="Doctors" />

          <div>
            <p className="text-2xl font-semibold text-gray-700">
              {dashData?.doctors || 0}
            </p>
            <p className="text-gray-400 text-sm">Doctors</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-6 min-w-64 rounded-lg border border-gray-100 shadow-sm">
          <img
            className="w-14"
            src={assets.appointments_icon}
            alt="Appointments"
          />

          <div>
            <p className="text-2xl font-semibold text-gray-700">
              {dashData?.appointments || 0}
            </p>
            <p className="text-gray-400 text-sm">Appointments</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-6 min-w-64 rounded-lg border border-gray-100 shadow-sm">
          <img className="w-14" src={assets.patients_icon} alt="Patients" />

          <div>
            <p className="text-2xl font-semibold text-gray-700">
              {dashData?.patients || 0}
            </p>
            <p className="text-gray-400 text-sm">Patients</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border mt-10 shadow-sm">
        <div className="flex items-center gap-2.5 px-6 py-4 border-b bg-gray-50 rounded-t-lg">
          <img className="w-5" src={assets.list_icon} alt="Latest bookings" />
          <p className="font-semibold text-gray-700">Latest Bookings (Pending Only)</p>
        </div>

        <div className="pt-2">
          {dashData?.latestAppointments?.length === 0 ? (
            <p className="px-6 py-4 text-sm text-gray-500">
              No pending bookings available.
            </p>
          ) : (
            dashData?.latestAppointments?.map((item) => (
              <div
                key={item.id}
                className="flex items-center px-6 py-4 gap-4 hover:bg-gray-50 border-b last:border-b-0 transition-all"
              >
                {item.doctorImage ? (
                  <img
                    src={item.doctorImage}
                    alt={item.doctorName}
                    className="w-10 h-10 rounded-full object-cover bg-gray-100"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    {item.doctorName?.charAt(0)?.toUpperCase() || "D"}
                  </div>
                )}

                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">
                    {item.patientName || "Patient"}
                  </p>

                  <p className="text-gray-500 text-xs">
                    With Dr. {item.doctorName || "Unknown Doctor"} —{" "}
                    {item.appointmentDate || "-"},{" "}
                    {item.appointmentTime || "-"}
                  </p>
                </div>

                {item.status === "cancelled" ? (
                  <p className="text-red-400 text-xs font-medium">
                    Cancelled
                  </p>
                ) : item.status === "completed" ? (
                  <p className="text-green-500 text-xs font-medium">
                    Completed
                  </p>
                ) : (
                  <button
                    onClick={() => cancelAppointment(item.id)}
                    className="text-red-500 border border-red-200 px-3 py-1.5 rounded-full text-xs hover:bg-red-50 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;