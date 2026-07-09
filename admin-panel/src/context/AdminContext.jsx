import { createContext, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

    const [aToken, setAToken] = useState(
        localStorage.getItem('aToken') || ''
    );

    const [dashData, setDashData] = useState(false);
    const [appointments, setAppointments] = useState([]);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // 🟢 Dashboard Data
    const getDashData = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/admin/dashboard`,
                { headers: { aToken } }
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

    // 🟢 All Appointments
    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/admin/appointments`,
                { headers: { aToken } }
            );

            if (data.success) {
                setAppointments(data.appointments.reverse());
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    };

    // 🔴 Cancel Appointment (مشتركة)
    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/admin/cancel-appointment`,
                { appointmentId },
                { headers: { aToken } }
            );

            if (data.success) {
                toast.success(data.message);

                // تحديث كل حاجة
                getDashData();
                getAllAppointments();

            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    };

    const value = {
        aToken, setAToken,
        backendUrl,

        dashData, getDashData,
        appointments, getAllAppointments,

        cancelAppointment
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;