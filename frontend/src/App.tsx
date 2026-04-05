// C:\Users\Admin\OneDrive\Desktop\BuyzaProject\hotellosys\src\App.tsx

import React, { useState, useEffect } from 'react';
import { 
  AppConfig, Room, RoomStatus, ActivityLog, License, LicenseStatus, User, HotelProperty
} from './types'; 

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import RoomsView from './views/Rooms';
import ReservationsView from './views/Reservations';
import BillingView from './views/Billing';
import HousekeepingView from './views/Housekeeping';
import StaffMobileHub from './views/StaffMobileHub';
import Settings from './views/Settings';
import AIButler from './components/AIButler';
import Login from './views/Login';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  
  const [config, setConfig] = useState<AppConfig>({
    hotelName: 'Buyza Grand HQ',
    address: 'Dar es Salaam, Tanzania',
    taxRate: 15,
    currency: 'TZS',
    setupComplete: true
  });

  const [license] = useState<License | null>({
    key: 'HOTELLO-2026-LIVE',
    status: LicenseStatus.VALID,
    modules: { rooms: true, restaurant: true, bar: true },
    expiresAt: '2030-01-01'
  });

  const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

  // Handle Login via Backend API
  const handleLogin = async (username: string, pass: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pass }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentUser(data.user);
        setIsLoggedIn(true);
        if (data.user.hotel) {
          setConfig(prev => ({ ...prev, hotelName: data.user.hotel.name }));
        }
      } else {
        alert(data.message || "Invalid credentials.");
      }
    } catch (error) {
      alert(`Connection error: Unable to reach backend at ${API_URL}`);
    }
  };

  const renderActiveView = () => {
    if (!currentUser) return null;
    switch (activeTab) {
      case 'dashboard': 
        return <Dashboard rooms={rooms} userRole={currentUser.role} setActiveTab={setActiveTab} />;
      case 'rooms': 
        return <RoomsView rooms={rooms} setRooms={setRooms} onUpdateStatus={() => {}} />;
      case 'settings': 
        return <Settings config={config} license={license} user={currentUser} onUpdateConfig={(upd) => setConfig(p => ({...p, ...upd}))} />;
      default: 
        return <Dashboard rooms={rooms} userRole={currentUser.role} setActiveTab={setActiveTab} />;
    }
  };

  const showFrame = isLoggedIn && activeTab !== 'staff_mobile';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-inter text-slate-900">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          {showFrame && <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} config={config} license={license} user={currentUser} />}
          <div className="flex-1 flex flex-col overflow-hidden">
            {showFrame && <Header activeTab={activeTab} hotelName={config.hotelName} />}
            <main className={`flex-1 overflow-y-auto ${showFrame ? 'p-4 lg:p-8' : ''}`}>
              <div className={showFrame ? "max-w-7xl mx-auto pb-20" : "h-full"}>{renderActiveView()}</div>
            </main>
          </div>
          {showFrame && <AIButler context={{ hotelName: config.hotelName, totalRooms: rooms.length, occupiedRooms: 5, staffCount: 10 }} />}
        </>
      )}
    </div>
  );
};

export default App;