import { createContext, useEffect, useState } from "react";
import { doctors as staticDoctors } from "../assets/assets_frontend/assets";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [firebaseDoctors, setFirebaseDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);

  const getDoctorsData = async () => {
    try {
      setDoctorsLoading(true);

      // Get doctors from Firebase
      const q = query(
        collection(db, "users"),
        where("role", "==", "doctor")
      );

      const snapshot = await getDocs(q);

      const doctorsFromFirebase = snapshot.docs.map((docItem) => ({
        _id: docItem.id, // توحيد الـ id مع باقي المشروع
        ...docItem.data(),
      }));

      setFirebaseDoctors(doctorsFromFirebase);
    } catch (error) {
      console.error("Error getting doctors:", error);
    } finally {
      setDoctorsLoading(false);
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  // دمج الدكاترة المحليين مع دكاترة Firebase
  const allDoctors = [...staticDoctors, ...firebaseDoctors].map((doctor) => {
    const rating = Number((4.2 + Math.random() * 0.8).toFixed(1));
    const reviews = Math.floor(Math.random() * 180 + 120);

    return {
      ...doctor,
      rating,
      reviews,
    };
  });

  // الدكاترة المتاحين
  const availableDoctors = allDoctors.filter(
    (doctor) => doctor.available !== false
  );

  const value = {
    doctors: allDoctors,
    availableDoctors,
    firebaseDoctors,
    doctorsLoading,
    refreshDoctors: getDoctorsData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};