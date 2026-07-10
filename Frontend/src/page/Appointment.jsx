import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { doctors, assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from '../components/RelatedDoctors';

// Core Structural Plumbing Imports
import { useAuth } from '../context/AuthContext';       // Pulls active user login token
import { bookAppointment } from '../clinicService';     // Pulls your transaction code

const Appointment = () => {
    const { docId } = useParams();
    const navigate = useNavigate();
    const Maps = (path) => navigate(path);

    // 1. Core State Hooks Mapping
    const { currentUser } = useAuth(); // Instantly read active client parameters
    const [docInfo, setDocInfo] = useState(null);
    const [actionLoading, setActionLoading] = useState(false); // Protect against fast double-clicks

    // Booking Widget States
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');

    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    // 2. Fetch Doctor Information
    useEffect(() => {
        const doc = doctors.find((d) => d._id === docId);
        setDocInfo(doc);
    }, [docId]);

    // 3. Generate 7 Days of Mock Booking Slots
    useEffect(() => {
        if (docInfo) {
            getAvailableSlots();
        }
    }, [docInfo]);

    const getAvailableSlots = () => {
        let allSlots = [];
        let today = new Date();

        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);
            const slotDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);

            let endTime = new Date(currentDate);
            endTime.setHours(21, 0, 0, 0);

            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() >= 10 ? currentDate.getHours() + 1 : 10);
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
            } else {
                currentDate.setHours(10, 0, 0, 0);
            }

            let timeSlots = [];
            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                timeSlots.push({
                    datetime: new Date(currentDate),
                    time: formattedTime
                });
                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }

            allSlots.push({
                day: daysOfWeek[slotDate.getDay()],
                date: slotDate.getDate(),
                // Format matching data queries cleanly: e.g., "Jul 9, 2026"
                dateLabel: slotDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
                slots: timeSlots
            });
        }
        setDocSlots(allSlots);
    };

    // 4. Execution Submission Pipe
    const handleBookingExecution = async () => {
        const selectedDate = docSlots[slotIndex]?.dateLabel || '';

        // Verification Checks
        if (!currentUser) {
            toast.error('Please log in to book an appointment');
            return;
        }

        if (!slotTime) {
            toast.warn('Please select a time slot before booking.');
            return;
        }

        if (!selectedDate) {
            toast.warn('Please select a date before booking.');
            return;
        }

        setActionLoading(true);

        // Package data footprint into your exact data architecture model
        const bookingPayload = {
            patientId: currentUser.uid,
            patientName: currentUser.displayName || currentUser.email.split('@')[0], // Reliable backup fallback
            doctorId: docId,
            doctorName: docInfo.name,
            doctorSpecialty: docInfo.speciality || "General Physician",
            date: selectedDate,
            timeSlot: slotTime
        };

        // Fire transaction engine query to compute sequential queue index positions
        const response = await bookAppointment(bookingPayload);

        if (response.success) {
            toast.success(`Confirmed! Queue Position Assigned: #${response.queueNumber}`);
            setTimeout(() => {
                Maps('/my-appointment');
            }, 1500);
        } else {
            toast.error(`System Booking Refused: ${response.error}`);
            setActionLoading(false);
        }
    };

    if (!docInfo) return <div className="flex justify-center my-20"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div>
            {/* ------- DOCTOR PROFILE SECTION ------- */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div>
                    <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt={docInfo.name} />
                </div>

                <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
                    <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
                        {docInfo.name}
                        <img className="w-5" src={assets.verified_icon} alt="Verified" />
                    </p>

                    <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
                    </div>

                    <div>
                        <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                            About <img src={assets.info_icon} alt="Info" />
                        </p>
                        <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
                    </div>

                    <p className="text-gray-500 font-medium mt-4">
                        Appointment fee: <span className="text-gray-900">${docInfo.fees}</span>
                    </p>
                </div>
            </div>

            {/* ------- BOOKING SLOTS WIDGET ------- */}
            <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
                <p>Booking slots</p>

                <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
                    {docSlots.length > 0 && docSlots.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => setSlotIndex(index)}
                            className={`text-center py-6 min-w-16 rounded-full cursor-pointer transition-all ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`}
                        >
                            <p>{item.day}</p>
                            <p>{item.date}</p>
                        </div>
                    ))}
                </div>

                <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
                    {docSlots.length > 0 && docSlots[slotIndex].slots.map((item, index) => (
                        <p
                            key={index}
                            onClick={() => setSlotTime(item.time)}
                            className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer transition-all ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`}
                        >
                            {item.time.toLowerCase()}
                        </p>
                    ))}
                </div>

                <button
                    disabled={actionLoading}
                    onClick={handleBookingExecution}
                    className={`bg-primary text-white text-sm font-light px-14 py-3 rounded-full mt-6 hover:opacity-90 ${actionLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    {actionLoading ? "Securing transaction packet..." : "Book an appointment"}
                </button>
            </div>

            {/* ------- RELATED DOCTORS COMPONENT ------- */}
            <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
        </div>
    );
};

export default Appointment;