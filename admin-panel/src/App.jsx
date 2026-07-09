import React, { useContext } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
// import Login from './pages/Login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AdminContext } from './context/AdminContext'
import { Routes, Route } from 'react-router-dom'

// Import Dashboard Pages
import Dashboard from './pages/Admin/Dashboard'
import AllAppointments from './pages/Admin/AllAppointments'
import AddDoctor from './pages/Admin/AddDoctor'
import DoctorsList from './pages/Admin/DoctorsList'
import DoctorDashboard from './pages/Doctor/DoctorDashboard'
import DoctorAppointments from './pages/Doctor/DoctorAppointments'
import DoctorProfile from './pages/Doctor/DoctorProfile'

function App() {
  return (
    <div className="bg-[#F8F9FD] min-h-screen">
      <Navbar />
      <ToastContainer />
      {/* <Login/>   */}
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/doctor-list' element={<DoctorsList />} />
          <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
          <Route path='/doctor-appointments' element={<DoctorAppointments />} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />
        </Routes>

        <main className="flex-1 p-5">
          <h1 className="text-2xl font-semibold"></h1>
        </main>
      </div>
    </div>
  )
}

export default App







// دا باستخدام الباك ايند

// import React, { useContext } from 'react'
// import './App.css'
// import Navbar from './components/Navbar'
// import Sidebar from './components/Sidebar'
// import Login from './pages/Login'
// import { ToastContainer } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
// import { AdminContext } from './context/AdminContext'
// import { Routes, Route } from 'react-router-dom'

// // Import Dashboard Pages
// import Dashboard from './pages/Admin/Dashboard'
// import AllAppointments from './pages/Admin/AllAppointments'
// import AddDoctor from './pages/Admin/AddDoctor'
// import DoctorsList from './pages/Admin/DoctorsList'

// function App() {
//   const { aToken } = useContext(AdminContext)
//   const { dToken } = useContext(AdminContext)

//   return aToken || dToken ? (
//     <div className='bg-[#F8F9FD] min-h-screen'>
//       <ToastContainer />
//       <Navbar />
//       <div className='flex items-start'>
//         <Sidebar />
//         <Routes>
//           <Route path='/' element={<></>} />
//           <Route path='/admin-dashboard' element={<Dashboard />} />
//           <Route path='/all-appointments' element={<AllAppointments />} />
//           <Route path='/add-doctor' element={<AddDoctor />} />
//           <Route path='/doctor-list' element={<DoctorsList />} />
//         </Routes>
//       </div>
//     </div>
//   ) : (
//     <>
//       <ToastContainer />
//       <Login />
//     </>
//   )
// }

// export default App