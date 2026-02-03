import React from 'react';
import NotificationBell from '../Finance/NotificationBell';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 sm:py-5">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">
            Properties HR
          </h1>
          <NotificationBell />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
