import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
// import { db } from '../../firebase';
// import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const DoctorDashboard = () => {

    const [dashData, setDashData] = useState(null);

    // ✅ جلب البيانات من Firebase
    const getDashData = async () => {
        const snapshot = await getDocs(collection(db, "appointments"));
        const data = snapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));

        // ✅ حساب الإحصائيات
        const earnings = data
            .filter(item => !item.cancelled && item.isCompleted)
            .reduce((sum, item) => sum + item.amount, 0);

        const appointments = data.length;

        const patients = new Set(
            data.map(item => item.userData?.name)
        ).size;

        const latestAppointments = data.slice(0, 5);

        setDashData({
            earnings,
            appointments,
            patients,
            latestAppointments
        });
    };

    // ✅ إلغاء الحجز
    const cancelAppointment = async (id) => {
        const ref = doc(db, "appointments", id);
        await updateDoc(ref, { cancelled: true });
        getDashData();
    };

    // ✅ إتمام الحجز
    const completeAppointment = async (id) => {
        const ref = doc(db, "appointments", id);
        await updateDoc(ref, { isCompleted: true });
        getDashData();
    };

    useEffect(() => {
        getDashData();
    }, []);

    return dashData && (
        <div className='m-5 w-full'>
            
            {/* Cards */}
            <div className='flex flex-wrap gap-5'>
                
                <div className='flex items-center gap-4 bg-white p-6 min-w-64 rounded-lg border shadow-sm'>
                    <img className='w-14' src={assets.earning_icon} alt="" />
                    <div>
                        <p className='text-2xl font-semibold text-gray-700'>$ {dashData.earnings}</p>
                        <p className='text-gray-400 text-sm'>Earnings</p>
                    </div>
                </div>

                <div className='flex items-center gap-4 bg-white p-6 min-w-64 rounded-lg border shadow-sm'>
                    <img className='w-14' src={assets.appointments_icon} alt="" />
                    <div>
                        <p className='text-2xl font-semibold text-gray-700'>{dashData.appointments}</p>
                        <p className='text-gray-400 text-sm'>Appointments</p>
                    </div>
                </div>

                <div className='flex items-center gap-4 bg-white p-6 min-w-64 rounded-lg border shadow-sm'>
                    <img className='w-14' src={assets.patients_icon} alt="" />
                    <div>
                        <p className='text-2xl font-semibold text-gray-700'>{dashData.patients}</p>
                        <p className='text-gray-400 text-sm'>Patients</p>
                    </div>
                </div>

            </div>

            {/* Latest Bookings */}
            <div className='bg-white rounded-lg border mt-10 shadow-sm'>
                <div className='flex items-center gap-2.5 px-6 py-4 border-b bg-gray-50'>
                    <img className='w-5' src={assets.list_icon} alt="" />
                    <p className='font-semibold text-gray-700'>Latest Bookings</p>
                </div>

                <div className='pt-2'>
                    {dashData.latestAppointments.length === 0 ? (
                        <p className='text-center py-5 text-gray-400'>No Data</p>
                    ) : (
                        dashData.latestAppointments.map((item) => (
                            <div key={item._id} className='flex items-center px-6 py-4 gap-4 hover:bg-gray-50 border-b last:border-b-0'>
                                
                                <img 
                                    className='w-10 h-10 rounded-full bg-gray-100 object-cover' 
                                    src={item.userData?.image || '/default-avatar.png'} 
                                    alt="" 
                                />

                                <div className='flex-1 text-sm'>
                                    <p className='text-gray-800 font-medium'>
                                        {item.userData?.name || 'Unknown'}
                                    </p>
                                    <p className='text-gray-500 text-xs'>
                                        {item.slotDate} | {item.slotTime}
                                    </p>
                                </div>
                                
                                {item.cancelled ? (
                                    <p className='text-red-400 text-xs font-semibold'>Cancelled</p>
                                ) : item.isCompleted ? (
                                    <p className='text-green-500 text-xs font-semibold'>Completed</p>
                                ) : (
                                    <div className='flex items-center gap-2'>
                                        <img 
                                            onClick={() => cancelAppointment(item._id)} 
                                            className='w-8 cursor-pointer p-1.5 hover:bg-red-50 rounded-full' 
                                            src={assets.cancel_icon} 
                                            alt="Cancel" 
                                        />
                                        <img 
                                            onClick={() => completeAppointment(item._id)} 
                                            className='w-8 cursor-pointer p-1.5 hover:bg-green-50 rounded-full' 
                                            src={assets.tick_icon} 
                                            alt="Complete" 
                                        />
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