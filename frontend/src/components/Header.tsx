// C:\Users\Admin\OneDrive\Desktop\BuyzaProject\hotellosys\src\components\Header.tsx

import React, { useState, useEffect } from 'react';

interface HeaderProps {
  activeTab: string;
  hotelName: string;
}

const Header: React.FC<HeaderProps> = ({ activeTab, hotelName }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTitle = (tab: string) => {
    return tab.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0 z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-slate-800">{formatTitle(activeTab)}</h2>
        <div className="h-4 w-px bg-slate-200 hidden md:block"></div>
        <p className="text-slate-400 text-sm hidden md:block">{hotelName}</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
          <i className="fa-solid fa-clock text-blue-500 text-xs"></i>
          <span className="text-sm font-medium text-slate-600">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors relative">
            <i className="fa-solid fa-bell"></i>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors">
            <i className="fa-solid fa-plus"></i>
            New Booking
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;