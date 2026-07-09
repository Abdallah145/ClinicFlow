import { createContext , useState } from "react";
import { doctors } from "../assets/assets_frontend/assets";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  // Global state for booked appointments
  const [appointments, setAppointments] = useState([]);

  // Function to add a new appointment
  const bookAppointment = (doctor, date, time) => {
    const newAppointment = {
      id: Date.now(), // Simple unique ID
      doctor,
      date,
      time,
    };
    setAppointments((prev) => [...prev, newAppointment]);
  };

  const value = {
    doctors,  //getDoctorsData,
    appointments,
    setAppointments,
    bookAppointment,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
