import { createContext, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [dToken, setDToken] = useState(
        localStorage.getItem('dToken') || ''
    );

    const [profileData, setProfileData] = useState(false);
    const [dashData, setDashData] = useState(false);

    // ================= PROFILE =================
    const getProfileData = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/doctor/profile`,
                { headers: { dToken } }
            );

            if (data.success) {
                setProfileData(data.profileData);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    };

    // ================= DASHBOARD =================
    const getDashData = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/doctor/dashboard`,
                { headers: { dToken } }
            );

            if (data.success) {
                setDashData(data.dashData);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    };

    // ================= APPOINTMENTS =================
    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/doctor/complete-appointment`,
                { appointmentId },
                { headers: { dToken } }
            );

            if (data.success) {
                toast.success(data.message);
                getDashData();
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/doctor/cancel-appointment`,
                { appointmentId },
                { headers: { dToken } }
            );

            if (data.success) {
                toast.success(data.message);
                getDashData();
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    };

    // ================= VALUE =================
    const value = {
        dToken, setDToken,
        backendUrl,

        profileData, setProfileData,
        dashData, setDashData,

        getProfileData,
        getDashData,

        completeAppointment,
        cancelAppointment
    };

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider;