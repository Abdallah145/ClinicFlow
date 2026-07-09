import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
// import { db } from '../../firebase'; // تأكد من المسار
// import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const DoctorAppointments = () => {

    const [appointments, setAppointments] = useState([]);

    // ✅ حساب العمر بشكل صحيح
    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);

        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    // ✅ جلب البيانات من Firebase
    const getAppointments = async () => {
        const snapshot = await getDocs(collection(db, "appointments"));
        const data = snapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));
        setAppointments(data);
    };

    // ✅ إلغاء الحجز
    const cancelAppointment = async (id) => {
        const ref = doc(db, "appointments", id);
        await updateDoc(ref, { cancelled: true });
        getAppointments();
    };

    // ✅ إتمام الحجز
    const completeAppointment = async (id) => {
        const ref = doc(db, "appointments", id);
        await updateDoc(ref, { isCompleted: true });
        getAppointments();
    };

    useEffect(() => {
        getAppointments();
    }, []);

    return (
        <div className='m-5 w-full'>
            <p className='mb-3 text-lg font-medium text-gray-700'>All Appointments</p>

            <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll shadow-sm'>
                
                {/* Header */}
                <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b bg-gray-50 text-gray-600 font-medium'>
                    <p>#</p>
                    <p>Patient</p>
                    <p>Payment</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p>Fees</p>
                    <p>Action</p>
                </div>

                {/* Data */}
                {appointments.length === 0 ? (
                    <p className='text-center py-5 text-gray-400'>No Appointments Found</p>
                ) : (
                    appointments.map((item, index) => (
                        <div 
                            key={item._id} 
                            className='grid grid-cols-[1fr_3fr_1fr] sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50 transition-all'
                        >
                            <p className='hidden sm:block'>{index + 1}</p>
                            
                            {/* Patient */}
                            <div className='flex items-center gap-2'>
                                <img 
                                    className='w-8 h-8 rounded-full bg-gray-100 object-cover' 
                                    src={item.userData?.image || '/default-avatar.png'} 
                                    alt="" 
                                />
                                <p className='text-gray-800 font-medium'>
                                    {item.userData?.name || 'Unknown'}
                                </p>
                            </div>

                            {/* Payment */}
                            <div>
                                <p className='text-xs inline border border-[#5F6FFF] px-2 py-0.5 rounded-full text-[#5F6FFF]'>
                                    {item.payment ? 'Online' : 'CASH'}
                                </p>
                            </div>

                            <p className='hidden sm:block'>
                                {calculateAge(item.userData?.dob)}
                            </p>

                            <p>{item.slotDate}, {item.slotTime}</p>
                            <p>${item.amount}</p>

                            {/* Actions */}
                            <div>
                                {item.cancelled ? (
                                    <p className='text-red-400 text-xs font-semibold'>Cancelled</p>
                                ) : item.isCompleted ? (
                                    <p className='text-green-500 text-xs font-semibold'>Completed</p>
                                ) : (
                                    <div className='flex items-center gap-2'>
                                        <img 
                                            onClick={() => cancelAppointment(item._id)} 
                                            className='w-8 cursor-pointer p-1.5 hover:bg-red-50 rounded-full transition-all' 
                                            src={assets.cancel_icon} 
                                            alt="Cancel" 
                                        />
                                        <img 
                                            onClick={() => completeAppointment(item._id)} 
                                            className='w-8 cursor-pointer p-1.5 hover:bg-green-50 rounded-full transition-all' 
                                            src={assets.tick_icon} 
                                            alt="Complete" 
                                        />
                                    </div>
                                )}
                            </div>

                        </div>
                    ))
                )}

            </div>
        </div>
    );
};

export default DoctorAppointments;