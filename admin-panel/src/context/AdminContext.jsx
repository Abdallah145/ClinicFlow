import { createContext, useState } from "react";
import { toast } from "react-toastify";
import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  doc,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [dashData, setDashData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. FETCH ALL REGISTERED DOCTORS
  const getAllDoctors = async () => {
    try {
      const doctorsQuery = query(
        collection(db, "users"),
        where("role", "==", "doctor")
      );

      const snapshot = await getDocs(doctorsQuery);
      const doctorsList = snapshot.docs.map((doctorDoc) => ({
        id: doctorDoc.id,
        ...doctorDoc.data(),
      }));

      setDoctors(doctorsList);
      return doctorsList;
    } catch (error) {
      console.error(error);
      toast.error("Could not load doctors: " + error.message);
      return [];
    }
  };

  // 2. FETCH MASTER CLINIC APPOINTMENTS LIST
  const getAllAppointments = async () => {
    try {
      const appointmentsQuery = query(
        collection(db, "appointments"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(appointmentsQuery);
      const allAppointments = snapshot.docs.map((appointmentDoc) => ({
        id: appointmentDoc.id,
        ...appointmentDoc.data(),
      }));

      setAppointments(allAppointments);
      return allAppointments;
    } catch (error) {
      console.error(error);
      toast.error("Could not load appointments: " + error.message);
      return [];
    }
  };

  // 3. GENERATE DASHBOARD ANALYTICS COUNTERS SUMMARY
  const getDashData = async () => {
    try {
      const [usersSnapshot, appointmentsSnapshot] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(collection(db, "appointments")),
      ]);

      const users = usersSnapshot.docs.map((userDoc) => userDoc.data());
      const allAppointments = appointmentsSnapshot.docs.map((appointmentDoc) => ({
        id: appointmentDoc.id,
        ...appointmentDoc.data(),
      }));

      const doctorCount = users.filter((user) => user.role === "doctor").length;
      const patientCount = users.filter((user) => user.role === "patient").length;

      // Safe chronological sort with conditional toDate checking guards
      const latestAppointments = [...allAppointments]
        .sort((a, b) => {
          const firstDate = a.createdAt?.toDate?.() || new Date(0);
          const secondDate = b.createdAt?.toDate?.() || new Date(0);
          return secondDate - firstDate;
        })
        .slice(0, 5);

      setDashData({
        doctors: doctorCount,
        patients: patientCount,
        appointments: allAppointments.length,
        latestAppointments,
      });
    } catch (error) {
      console.error(error);
      toast.error("Could not load dashboard: " + error.message);
    }
  };

  // 4. ADMIN DIRECT CANCELLATION OVERRIDE
  const cancelAppointment = async (appointmentId) => {
    try {
      await updateDoc(doc(db, "appointments", appointmentId), {
        status: "cancelled",
        updatedAt: new Date(),
      });

      toast.success("Appointment cancelled");

      // Cascade structural sync updates downstream
      await getDashData();
      await getAllAppointments();
    } catch (error) {
      console.error(error);
      toast.error("Could not cancel appointment: " + error.message);
    }
  };

  // 5. TOGGLE DOCTOR AVAILABILITY STATE MUTATOR
  const toggleDoctorAvailability = async (doctorId, currentAvailability) => {
    try {
      const nextAvailability = !currentAvailability;
      await updateDoc(doc(db, "users", doctorId), {
        available: nextAvailability,
        updatedAt: new Date(),
      });

      toast.success(
        nextAvailability
          ? "Doctor is now available on public patient grids"
          : "Doctor has been hidden from public search parameters"
      );

      // Re-trigger clean state streams instantly
      await getAllDoctors();
      await getDashData();
    } catch (error) {
      console.error(error);
      toast.error("Could not update doctor availability: " + error.message);
    }
  };

  const value = {
    dashData,
    appointments,
    doctors,
    loading,
    setLoading,
    getDashData,
    getAllAppointments,
    getAllDoctors,
    cancelAppointment,
    toggleDoctorAvailability,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;