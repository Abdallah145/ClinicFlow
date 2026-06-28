/* eslint-disable no-unused-vars */
import React from 'react'
import { Route , Routes } from 'react-router-dom'
import Home from './page/Home.jsx'
import Doctors from './page/Doctors.jsx'
import Navbar from './components/Navbar.jsx'
import Login from './page/Login.jsx'
import About from './page/About.jsx'
import Contact from './page/Contact.jsx'
import MyProfile from './page/MyProfile.jsx'
import MyAppointments from './page/MyAppointments.jsx'
import Appointment from './page/Appointment.jsx'

const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]" >
        <Navbar />
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/doctors' element={<Doctors />} />
            <Route path='/doctors/:speciality' element={<Doctors />} />
            <Route path='/login' element={<Login/>} />
            <Route path='/about' element={<About/>} />
            <Route path='/contact' element={<Contact/>} />
            <Route path='/my-profile' element={<MyProfile/>} />
            <Route path='/my-appointment' element={<MyAppointments/>} />
            <Route path='/appointment/:docId' element={<Appointment/>} />
        </Routes>
    </div>
  )
}

export default App