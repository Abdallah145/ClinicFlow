import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { auth, db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

const DoctorDashboard = () => {
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getDashData = async () => {
    try {
      setLoading(true);

      const currentDoctor = auth.currentUser;

      if (!currentDoctor) {
        setDashData({
          earnings: 0,
          appointments: 0,
          patients: 0,
          latestAppointments: [],
        });
        return;
      }

      const appointmentsSnapshot = await getDocs(
        collection(db, "appointments")
      );

      const allAppointments = appointmentsSnapshot.docs.map(
        (appointmentDoc) => ({
          id: appointmentDoc.id,
          ...appointmentDoc.data(),
        })
      );

      // الدكتور يشوف الحجوزات المرتبطة بحسابه فقط
      const doctorAppointments = allAppointments.filter(
        (appointment) => appointment.doctorId === currentDoctor.uid
      );

      // الأرباح من الحجوزات المكتملة فقط
      const earnings = doctorAppointments
        .filter((appointment) => appointment.status === "completed")
        .reduce(
          (total, appointment) => total + Number(appointment.fees || 0),
          0
        );

      // عدد المرضى المختلفين عند الدكتور
      const patients = new Set(
        doctorAppointments.map((appointment) => appointment.patientId)
      ).size;

      // Filter only pending appointments for the dashboard list
      const pendingAppointments = doctorAppointments.filter(
        (appointment) => appointment.status !== "completed" && appointment.status !== "cancelled"
      );

      // ترتيب الحجوزات الأحدث أولًا
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
        earnings,
        appointments: doctorAppointments.length,
        patients,
        latestAppointments,
      });
    } catch (error) {
      console.error("Doctor dashboard error:", error);
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

  const completeAppointment = async (appointmentId) => {
    try {
      await updateDoc(doc(db, "appointments", appointmentId), {
        status: "completed",
        updatedAt: new Date(),
      });

      getDashData();
    } catch (error) {
      console.error("Complete appointment error:", error);
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
        <div className="flex items-center gap-4 bg-white p-6 min-w-64 rounded-lg border shadow-sm">
          <img className="w-14" src={assets.earning_icon} alt="Earnings" />

          <div>
            <p className="text-2xl font-semibold text-gray-700">
              ${dashData?.earnings || 0}
            </p>
            <p className="text-gray-400 text-sm">Earnings</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-6 min-w-64 rounded-lg border shadow-sm">
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

        <div className="flex items-center gap-4 bg-white p-6 min-w-64 rounded-lg border shadow-sm">
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
        <div className="flex items-center gap-2.5 px-6 py-4 border-b bg-gray-50">
          <img className="w-5" src={assets.list_icon} alt="Latest bookings" />
          <p className="font-semibold text-gray-700">Latest Bookings (Pending Only)</p>
        </div>

        <div className="pt-2">
          {dashData?.latestAppointments?.length === 0 ? (
            <p className="text-center py-5 text-gray-400">
              No pending appointments.
            </p>
          ) : (
            dashData?.latestAppointments?.map((item) => (
              <div
                key={item.id}
                className="flex items-center px-6 py-4 gap-4 hover:bg-gray-50 border-b last:border-b-0"
              >
                {item.patientImage ? (
                  <img className="w-10 h-10 rounded-full object-cover shrink-0" src={item.patientImage} alt={item.patientName} />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold shrink-0">
                    {item.patientName?.charAt(0)?.toUpperCase() || "P"}
                  </div>
                )}

                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">
                    {item.patientName || "Patient"}
                  </p>

                  <p className="text-gray-500 text-xs">
                    {item.appointmentDate || "-"} |{" "}
                    {item.appointmentTime || "-"}
                  </p>
                </div>

                {item.status === "cancelled" ? (
                  <p className="text-red-400 text-xs font-semibold">
                    Cancelled
                  </p>
                ) : item.status === "completed" ? (
                  <p className="text-green-500 text-xs font-semibold">
                    Completed
                  </p>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => cancelAppointment(item.id)}
                      className="bg-red-100 hover:bg-red-600 hover:text-white text-red-700 px-4 py-2.5 rounded-lg font-bold text-xs transition-all shadow-sm cursor-pointer"
                      title="Cancel Appointment"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => completeAppointment(item.id)}
                      className="bg-green-100 hover:bg-green-600 hover:text-white text-green-700 px-4 py-2.5 rounded-lg font-bold text-xs transition-all shadow-sm cursor-pointer"
                      title="Complete Appointment"
                    >
                      Complete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;