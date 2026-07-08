import React from 'react';

const Sidebar = () => {
  return (
    <aside className="bg-white border-r w-64 min-h-[calc(100vh-70px)]">
      <nav className="flex flex-col">
        <a href="#" className="p-4 flex items-center border-b bg-blue-50 border-r-4 border-blue-600">Dashboard</a>
        <a href="#" className="p-4 flex items-center border-b">Appointments</a>
        <a href="#" className="p-4 flex items-center border-b">Add Doctor</a>
        <a href="#" className="p-4 flex items-center border-b">Doctors List</a>
      </nav>
    </aside>
  );
};

export default Sidebar;
