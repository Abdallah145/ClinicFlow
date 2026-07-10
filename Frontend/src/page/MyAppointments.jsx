import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// Core Structural Architecture Imports
import { useAuth } from '../context/AuthContext';             // Pulls active user login session
import { getPatientAppointments } from '../clinicService';   // Pulls your custom Firestore query engine

const MyAppointments = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch live appointment documents from Firestore matching the patient's UID
  useEffect(() => {
    if (!currentUser?.uid) return;

    const fetchUserBookings = async () => {
      setLoading(true);
      const result = await getPatientAppointments(currentUser.uid);

      if (result.success) {
        setAppointments(result.appointments);
      } else {
        toast.error(`Failed to load appointments: ${result.error}`);
      }
      setLoading(false);
    };

    fetchUserBookings();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <section className="max-w-6xl mx-auto rounded-3xl bg-white shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-6 sm:px-8 sm:py-8 border-b border-slate-200">
          <h1 className="text-2xl font-semibold text-slate-900">My appointments</h1>
          <p className="mt-2 text-sm text-slate-500">Review your upcoming consultations and track your position in the clinic queue line.</p>
        </div>

        {appointments.length === 0 ? (
          <div className="px-6 py-10 text-center text-slate-500">No appointments booked yet. Book a consultation to see it here.</div>
        ) : (
          <div className="divide-y divide-slate-200">
            {appointments.map((appointment) => (
              <article key={appointment.id} className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 last:border-0">
                <div className="flex gap-4 sm:flex-1">

                  {/* Doctor Thumbnail (Displays fallback initials icon or image placeholder if available) */}
                  <div className="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600 font-bold text-xl border border-indigo-100">
                    {appointment.doctorName ? appointment.doctorName.split(' ').map(n => n[0]).join('').toUpperCase() : 'DOC'}
                  </div>

                  <div className="flex flex-col justify-between gap-2 text-slate-900">
                    <div>
                      {/* Read directly from your denormalized data package strings! */}
                      <h2 className="text-lg font-semibold">{appointment.doctorName}</h2>
                      <p className="text-sm text-slate-500">{appointment.doctorSpecialty}</p>
                    </div>

                    <div className="space-y-1 text-sm text-slate-700">
                      <p className="font-medium text-slate-900">Queue Parameters:</p>
                      <p className="text-sm text-indigo-600 font-semibold">
                        Queue Position: #{appointment.queueNumber}
                      </p>
                      <p className="text-xs text-slate-400">Ticket ID: {appointment.id}</p>
                      <p className="pt-2 text-slate-500 font-medium">
                        Date & Time: <span className="text-slate-800">{appointment.date} | {appointment.timeSlot}</span>
                      </p>
                      <p className="text-xs">
                        Status Tag: <span className={`font-semibold ${appointment.status === 'active' ? 'text-blue-600' : appointment.status === 'completed' ? 'text-green-600' : 'text-amber-600'}`}>{appointment.status.toUpperCase()}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Call-To-Action Operations Buttons */}
                <div className="flex flex-col items-start gap-3 sm:items-end sm:justify-end">
                  <button className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 cursor-pointer">
                    Pay Online
                  </button>
                  <button
                    disabled={appointment.status === 'completed' || appointment.status === 'active'}
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:border-red-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Cancel appointment
                  </button>
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