import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "react-toastify";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState("");

  const getMyAppointments = async () => {
    const user = auth.currentUser;

    if (!user) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const appointmentsQuery = query(
        collection(db, "appointments"),
        where("patientId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(appointmentsQuery);

      const appointmentsData = snapshot.docs.map((appointmentDoc) => ({
        id: appointmentDoc.id,
        ...appointmentDoc.data(),
      }));

      setAppointments(appointmentsData);
    } catch (error) {
      console.error(error);
      toast.error("Could not load appointments: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyAppointments();
  }, []);

  const cancelAppointment = async (appointmentId) => {
    try {
      setCancellingId(appointmentId);

      await updateDoc(doc(db, "appointments", appointmentId), {
        status: "cancelled",
        updatedAt: serverTimestamp(),
      });

      toast.success("Appointment cancelled");
      await getMyAppointments();
    } catch (error) {
      console.error(error);
      toast.error("Could not cancel appointment: " + error.message);
    } finally {
      setCancellingId("");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-6">
        <div className="max-w-6xl mx-auto text-center text-slate-500">
          Loading appointments...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <section className="max-w-6xl mx-auto rounded-3xl bg-white shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-6 sm:px-8 sm:py-8 border-b border-slate-200">
          <h1 className="text-2xl font-semibold text-slate-900">
            My appointments
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Review your upcoming consultations.
          </p>
        </div>

        {appointments.length === 0 ? (
          <div className="px-6 py-10 text-center text-slate-500">
            No appointments booked yet. Book a consultation to see it here.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {appointments.map((appointment) => (
              <article
                key={appointment.id}
                className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex gap-4 sm:flex-1">
                  <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl bg-indigo-50">
                    {appointment.doctorImage ? (
                      <img
                        src={appointment.doctorImage}
                        alt={appointment.doctorName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl text-indigo-400">
                        {appointment.doctorName?.charAt(0) || "D"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col justify-between gap-2 text-slate-900">
                    <div>
                      <h2 className="text-lg font-semibold">
                        {appointment.doctorName}
                      </h2>

                      <p className="text-sm text-slate-500">
                        {appointment.doctorSpeciality}
                      </p>
                    </div>

                    <div className="space-y-1 text-sm text-slate-700">
                      <p className="font-medium text-slate-900">Address:</p>

                      <p>{appointment.doctorAddress?.line1 || "-"}</p>
                      <p>{appointment.doctorAddress?.line2 || "-"}</p>

                      <p className="pt-2 text-slate-500">
                        Date & Time: {appointment.appointmentDate} |{" "}
                        {appointment.appointmentTime}
                      </p>

                      <p
                        className={`font-medium ${
                          appointment.status === "cancelled"
                            ? "text-red-500"
                            : appointment.status === "confirmed"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        Status: {appointment.status || "pending"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Call-To-Action Operations Buttons */}
                <div className="flex flex-col items-start gap-3 sm:items-end sm:justify-end">
                  <button
                    disabled
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-slate-100 px-5 py-2 text-sm font-medium text-slate-500"
                  >
                    Payment: {appointment.paymentStatus || "unpaid"}
                  </button>

                  {appointment.status !== "cancelled" && (
                    <button
                      onClick={() => cancelAppointment(appointment.id)}
                      disabled={cancellingId === appointment.id}
                      className="inline-flex items-center justify-center rounded-full border border-red-200 bg-white px-5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                    >
                      {cancellingId === appointment.id
                        ? "Cancelling..."
                        : "Cancel appointment"}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default MyAppointments;