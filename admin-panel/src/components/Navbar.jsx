import React from 'react';

const Navbar = ({ onLogout }) => {
  return (
    <header className="bg-white border-b flex justify-between items-center px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-blue-600 text-2xl font-bold">Healix</span>
        <span className="border border-gray-300 rounded-full px-2.5 py-0.5 text-xs text-gray-500">Admin</span>
      </div>

      <div>
        <button
          onClick={onLogout}
          className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm hover:opacity-90"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
