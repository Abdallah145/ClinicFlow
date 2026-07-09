import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorProfile = () => {
    const { dToken, profileData, getProfileData, backendUrl, setProfileData } = useContext(DoctorContext);
    const [isEdit, setIsEdit] = useState(false);

    // دالة تحديث الحقول وإرسالها للسيرفر
    const updateProfile = async () => {
        try {
            const updateData = {
                fees: profileData.fees,
                address: profileData.address,
                available: profileData.available
            };

            const { data } = await axios.post(`${backendUrl}/api/doctor/update-profile`, updateData, { headers: { dToken } });

            if (data.success) {
                toast.success(data.message);
                setIsEdit(false);
                getProfileData(); // إعادة جلب البيانات للتأكيد
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };

    useEffect(() => {
        if (dToken) {
            getProfileData();
        }
    }, [dToken]);

    return profileData && (
        <div className='m-5 w-full max-w-3xl'>
            <div className='flex flex-col gap-4 p-8 bg-white rounded-lg border shadow-sm'>
                
                {/* صورة الطبيب */}
                <div>
                    <img className='w-full sm:max-w-64 bg-[#5F6FFF] rounded-lg object-cover' src={profileData.image} alt="" />
                </div>

                {/* الاسم والمعلومات الأساسية */}
                <div className='flex-1 text-sm text-zinc-600'>
                    <p className='text-3xl font-medium text-gray-800'>{profileData.name}</p>
                    <div className='flex items-center gap-2 mt-1 text-gray-600'>
                        <p>{profileData.degree} - {profileData.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{profileData.experience} Years Experience</button>
                    </div>

                    {/* النبذة التعريفية (About) */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>About:</p>
                        <p className='text-xs text-gray-600 max-w-[700px] mt-1'>{profileData.about}</p>
                    </div>

                    {/* تكلفة الاستشارة (Fees) */}
                    <p className='text-gray-600 font-medium mt-4'>
                        Appointment Fee: <span className='text-gray-800'>$ {isEdit ? (
                            <input type="number" className='border px-2 py-0.5 w-24 rounded outline-none' onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} value={profileData.fees} />
                        ) : profileData.fees}</span>
                    </p>

                    {/* عنوان العيادة (Address) */}
                    <div className='flex gap-2 py-2 mt-2'>
                        <p className='font-medium text-gray-700'>Address:</p>
                        <div className='text-xs'>
                            {isEdit ? (
                                <input type="text" className='border p-1 rounded w-full mb-1 outline-none' onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={profileData.address.line1} />
                            ) : profileData.address.line1}
                            <br />
                            {isEdit ? (
                                <input type="text" className='border p-1 rounded w-full outline-none' onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={profileData.address.line2} />
                            ) : profileData.address.line2}
                        </div>
                    </div>

                    {/* حالة التوافر (Available Switch Checkbox) */}
                    <div className='flex gap-1 pt-2 items-center'>
                        <input type="checkbox" id='available' onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))} checked={profileData.available} disabled={!isEdit} className='cursor-pointer w-4 h-4' />
                        <label htmlFor="available" className='text-sm text-gray-600 font-medium cursor-pointer select-none ml-1'>Available for Appointments</label>
                    </div>

                    {/* زر التعديل أو الحفظ الجانبي */}
                    {isEdit ? (
                        <button onClick={updateProfile} className='px-4 py-2 border border-[#5F6FFF] text-sm rounded-full mt-6 hover:bg-[#5F6FFF] hover:text-white transition-all duration-300'>Save Changes</button>
                    ) : (
                        <button onClick={() => setIsEdit(true)} className='px-4 py-2 border border-gray-300 text-sm rounded-full mt-6 hover:bg-[#5F6FFF] hover:text-white transition-all duration-300'>Edit Profile</button>
                    )}

                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;