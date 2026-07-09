import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const Sidebar = () => {
  return (
    <div className='min-h-screen bg-white border-r'>
      <ul className='text-[#515151] mt-5'>

        {/* Dashboard */}
        <NavLink 
          className={({ isActive }) => 
            `flex items-center gap-3 py-3.5 px-6 md:px-9 md:min-w-72 cursor-pointer transition-all ${
              isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5F6FFF]' : ''
            }`
          } 
          to={'/admin-dashboard'}
        >
          <img className='w-5' src={assets.home_icon} alt="" />
          <p className='hidden md:block'>Dashboard</p>
        </NavLink>

        {/* Appointments */}
        <NavLink 
          className={({ isActive }) => 
            `flex items-center gap-3 py-3.5 px-6 md:px-9 md:min-w-72 cursor-pointer transition-all ${
              isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5F6FFF]' : ''
            }`
          } 
          to={'/all-appointments'}
        >
          <img className='w-5' src={assets.appointment_icon} alt="" />
          <p className='hidden md:block'>Appointments</p>
        </NavLink>

        {/* Add Doctor */}
        <NavLink 
          className={({ isActive }) => 
            `flex items-center gap-3 py-3.5 px-6 md:px-9 md:min-w-72 cursor-pointer transition-all ${
              isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5F6FFF]' : ''
            }`
          } 
          to={'/add-doctor'}
        >
          <img className='w-5' src={assets.add_icon} alt="" />
          <p className='hidden md:block'>Add Doctor</p>
        </NavLink>

        {/* Doctors List */}
        <NavLink 
          className={({ isActive }) => 
            `flex items-center gap-3 py-3.5 px-6 md:px-9 md:min-w-72 cursor-pointer transition-all ${
              isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5F6FFF]' : ''
            }`
          } 
          to={'/doctor-list'}
        >
          <img className='w-5' src={assets.people_icon} alt="" />
          <p className='hidden md:block'>Doctors List</p>
        </NavLink>

        {/* Doctor Dashboard */}
        <p className='text-[#515151] mt-5 px-6 md:px-9 text-sm font-medium'>Doctor</p>
        <NavLink 
          className={({ isActive }) => 
            `flex items-center gap-3 py-3.5 px-6 md:px-9 md:min-w-72 cursor-pointer transition-all ${
              isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5F6FFF]' : ''
            }`
          } 
          to={'/doctor-dashboard'}
        >
          <img className='w-5' src={assets.home_icon} alt="" />
          <p className='hidden md:block'>Dashboard</p>
        </NavLink>

        <NavLink 
          className={({ isActive }) => 
            `flex items-center gap-3 py-3.5 px-6 md:px-9 md:min-w-72 cursor-pointer transition-all ${
              isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5F6FFF]' : ''
            }`
          } 
          to={'/doctor-appointments'}
        >
          <img className='w-5' src={assets.appointment_icon} alt="" />
          <p className='hidden md:block'>Appointments</p>
        </NavLink>

        <NavLink 
          className={({ isActive }) => 
            `flex items-center gap-3 py-3.5 px-6 md:px-9 md:min-w-72 cursor-pointer transition-all ${
              isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5F6FFF]' : ''
            }`
          } 
          to={'/doctor-profile'}
        >
          <img className='w-5' src={assets.add_icon} alt="" />
          <p className='hidden md:block'>Profile</p>
        </NavLink>

      </ul>
    </div>
  );
};

export default Sidebar;







// دا باستخدام الباك ايند

// import React, { useContext } from 'react';
// import { AdminContext } from '../context/AdminContext';
// import { DoctorContext } from '../context/DoctorContext';
// import { NavLink } from 'react-router-dom';
// import { assets } from '../assets/assets';

// const Sidebar = () => {

//     const { aToken } = useContext(AdminContext);
//     const { dToken } = useContext(DoctorContext);

//     const linkClass = ({ isActive }) =>
//         `flex items-center gap-3 py-3.5 px-6 md:px-9 cursor-pointer transition-all ${
//             isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5F6FFF]' : ''
//         }`;

//     return (
//         <div className='min-h-screen bg-white border-r border-gray-100 w-64 pt-5 hidden sm:block'>

//             {/* 🟢 Admin */}
//             {aToken && (
//                 <ul className='text-[#515151] mt-5'>

//                     <NavLink to='/admin-dashboard' className={linkClass}>
//                         <img className='w-5' src={assets.home_icon} alt="" />
//                         <p className='hidden md:block'>Dashboard</p>
//                     </NavLink>

//                     <NavLink to='/all-appointments' className={linkClass}>
//                         <img className='w-5' src={assets.appointment_icon} alt="" />
//                         <p className='hidden md:block'>Appointments</p>
//                     </NavLink>

//                     <NavLink to='/add-doctor' className={linkClass}>
//                         <img className='w-5' src={assets.add_icon} alt="" />
//                         <p className='hidden md:block'>Add Doctor</p>
//                     </NavLink>

//                     <NavLink to='/doctor-list' className={linkClass}>
//                         <img className='w-5' src={assets.people_icon} alt="" />
//                         <p className='hidden md:block'>Doctors List</p>
//                     </NavLink>

//                 </ul>
//             )}

//             {/* 🔵 Doctor */}
//             {dToken && (
//                 <ul className='text-[#515151] mt-5'>

//                     <NavLink to='/doctor-dashboard' className={linkClass}>
//                         <img className='w-5' src={assets.home_icon} alt="" />
//                         <p className='hidden md:block'>Dashboard</p>
//                     </NavLink>

//                     <NavLink to='/doctor-appointments' className={linkClass}>
//                         <img className='w-5' src={assets.appointment_icon} alt="" />
//                         <p className='hidden md:block'>Appointments</p>
//                     </NavLink>

//                     <NavLink to='/doctor-profile' className={linkClass}>
//                         <img className='w-5' src={assets.people_icon} alt="" />
//                         <p className='hidden md:block'>Profile</p>
//                     </NavLink>

//                 </ul>
//             )}

//         </div>
//     );
// };

// export default Sidebar;