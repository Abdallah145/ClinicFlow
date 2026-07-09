import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { assets } from '../../assets/assets'; 

const Dashboard = () => {
    const { aToken, dashData, getDashData, cancelAppointment } = useContext(AdminContext);

    useEffect(() => {
        if (aToken) {
            getDashData();
        }
    }, [aToken]);

    return dashData && (
        <div className='m-5 w-full'>
            
            {/* كروت الإحصائيات العلوية */}
            <div className='flex flex-wrap gap-5'>
                
                {/* كرت الأطباء */}
                <div className='flex items-center gap-4 bg-white p-6 min-w-64 rounded-lg border border-gray-100 shadow-sm'>
                    <img className='w-14' src={assets.doctor_icon} alt="" />
                    <div>
                        <p className='text-2xl font-semibold text-gray-700'>{dashData.doctors}</p>
                        <p className='text-gray-400 text-sm'>Doctors</p>
                    </div>
                </div>

                {/* كرت الحجوزات */}
                <div className='flex items-center gap-4 bg-white p-6 min-w-64 rounded-lg border border-gray-100 shadow-sm'>
                    <img className='w-14' src={assets.appointments_icon} alt="" />
                    <div>
                        <p className='text-2xl font-semibold text-gray-700'>{dashData.appointments}</p>
                        <p className='text-gray-400 text-sm'>Appointments</p>
                    </div>
                </div>

                {/* كرت المرضى */}
                <div className='flex items-center gap-4 bg-white p-6 min-w-64 rounded-lg border border-gray-100 shadow-sm'>
                    <img className='w-14' src={assets.patients_icon} alt="" />
                    <div>
                        <p className='text-2xl font-semibold text-gray-700'>{dashData.patients}</p>
                        <p className='text-gray-400 text-sm'>Patients</p>
                    </div>
                </div>

            </div>

            {/* قسم آخر الحجوزات المضافة */}
            <div className='bg-white rounded-lg border mt-10 shadow-sm'>
                <div className='flex items-center gap-2.5 px-6 py-4 border-b bg-gray-50 rounded-t-lg'>
                    <img className='w-5' src={assets.list_icon} alt="" />
                    <p className='font-semibold text-gray-700'>Latest Bookings</p>
                </div>

                <div className='pt-2'>
                    {dashData.latestAppointments.map((item, index) => (
                        <div key={index} className='flex items-center px-6 py-4 gap-4 hover:bg-gray-50 border-b last:border-b-0 transition-all'>
                            <img className='w-10 h-10 rounded-full bg-gray-100 object-cover' src={item.docData.image} alt="" />
                            <div className='flex-1 text-sm'>
                                <p className='text-gray-800 font-medium'>{item.docData.name}</p>
                                <p className='text-gray-500 text-xs'>Booking on: {item.slotDate}</p>
                            </div>
                            
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
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Dashboard;