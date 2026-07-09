import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { assets } from '../../assets/assets'; // تأكد من صحة مسار ملف الـ assets

const AllAppointments = () => {
    const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext);

    // حساب الأعمار بشكل تقريبي بناءً على تاريخ الميلاد أو جلبها مباشرة
    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        return age;
    };

    useEffect(() => {
        if (aToken) {
            getAllAppointments();
        }
    }, [aToken]);

    return (
        <div className='m-5 w-full'>
            <p className='mb-3 text-lg font-medium text-gray-700'>All Appointments</p>

            <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll shadow-sm'>
                
                {/* العناوين الرئيسية للجدول */}
                <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b bg-gray-50 text-gray-600 font-medium'>
                    <p>#</p>
                    <p>Patient</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p>Doctor Name</p>
                    <p>Fees</p>
                    <p>Action</p>
                </div>

                {/* عرض البيانات بعمل حلقة map */}
                {appointments.map((item, index) => (
                    <div 
                        key={index} 
                        className='grid grid-cols-[1fr_3fr_1fr] sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50 transition-all'
                    >
                        {/* الترقيم */}
                        <p className='hidden sm:block'>{index + 1}</p>

                        {/* بيانات المريض */}
                        <div className='flex items-center gap-2'>
                            <img className='w-8 h-8 rounded-full bg-gray-100 object-cover' src={item.userData.image} alt="" />
                            <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                        </div>

                        {/* العمر */}
                        <p className='hidden sm:block'>{calculateAge(item.userData.dob)}</p>

                        {/* التاريخ والوقت المختار للحجز */}
                        <p>{item.slotDate}, {item.slotTime}</p>

                        {/* اسم وصورة الدكتور المعالج */}
                        <div className='flex items-center gap-2'>
                            <img className='w-8 h-8 rounded-full bg-gray-100 object-cover' src={item.docData.image} alt="" />
                            <p className='text-gray-800 font-medium'>{item.docData.name}</p>
                        </div>

                        {/* السعر */}
                        <p className='hidden sm:block'>${item.amount}</p>

                        {/* أزرار التحكم والإلغاء */}
                        <div>
                            {item.cancelled ? (
                                <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                            ) : (
                                <img 
                                    onClick={() => cancelAppointment(item._id)} 
                                    className='w-8 cursor-pointer p-1.5 hover:bg-red-50 rounded-full transition-all' 
                                    src={assets.cancel_icon} 
                                    alt="Cancel" 
                                />
                            )}
                        </div>

                    </div>
                ))}

            </div>
        </div>
    );
};

export default AllAppointments;