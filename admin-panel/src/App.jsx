import React from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

function App() {
  return (
    <div className="bg-[#F8F9FD] min-h-screen">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-5">
          <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
        </main>
      </div>
    </div>
  )
}

export default App
