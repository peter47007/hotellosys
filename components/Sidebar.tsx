
import React from 'react';
import { AppConfig, License, User } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  config: AppConfig;
  license: License | null;
  user?: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, config, license, user }) => {
  const isGuest = user?.role === 'Guest';
  const isManager = user?.role === 'Manager' || user?.role === 'Admin' || user?.role === 'HotelOwner';

  const navItems = isGuest ? [
    { id: 'guest', label: 'Guest Portal', icon: 'fa-user-gear', enabled: true },
    { id: 'marketing', label: 'Loyalty Hub', icon: 'fa-crown', enabled: true },
    { id: 'support', label: 'Help & Support', icon: 'fa-circle-question', enabled: true },
  ] : [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie', enabled: true },
    { id: 'manager_web', label: 'Remote Access', icon: 'fa-mobile-button', enabled: isManager },
    { id: 'mobile_command', label: 'Mobile Control', icon: 'fa-signal-stream', enabled: isManager },
    { id: 'rooms', label: 'Room Master', icon: 'fa-door-open', enabled: license?.modules.rooms },
    { id: 'reservations', label: 'Reservations', icon: 'fa-calendar-check', enabled: license?.modules.rooms },
    { id: 'housekeeping', label: 'Housekeeping', icon: 'fa-broom-ball', enabled: true },
    { id: 'reports', label: 'Reports & Analytics', icon: 'fa-chart-mixed', enabled: true },
    { id: 'billing', label: 'Billing & Folio', icon: 'fa-file-invoice-dollar', enabled: true },
    { id: 'marketing', label: 'Marketing Hub', icon: 'fa-bullhorn', enabled: true },
    { id: 'restaurant', label: 'Restaurant', icon: 'fa-utensils', enabled: license?.modules.restaurant },
    { id: 'inventory', label: 'Supply Chain', icon: 'fa-boxes-stacked', enabled: true },
    { id: 'employees', label: 'People Ops', icon: 'fa-users-gear', enabled: true },
    { id: 'audit_vault', label: 'Audit Vault', icon: 'fa-shield-halved', enabled: isManager },
    { id: 'gdpr_manager', label: 'GDPR Rights', icon: 'fa-user-lock', enabled: isManager },
    { id: 'compliance', label: 'Compliance Hub', icon: 'fa-clipboard-check', enabled: isManager },
    { id: 'system_health', label: 'System Health', icon: 'fa-heart-pulse', enabled: isManager },
    { id: 'support', label: 'Training Hub', icon: 'fa-graduation-cap', enabled: true },
    { id: 'settings', label: 'System Settings', icon: 'fa-cog', enabled: true },
  ];

  return (
    <aside className="w-20 lg:w-64 bg-slate-900 text-slate-400 flex flex-col border-r border-slate-800 transition-all duration-300">
      <div className="p-4 lg:p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center text-white shadow-lg overflow-hidden relative group shrink-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#004aad] to-[#f16522] animate-gradient-xy"></div>
            <i className="fa-solid fa-b text-xl lg:text-2xl relative z-10 font-black"></i>
          </div>
          <div className="hidden lg:block overflow-hidden">
            <h1 className="text-white font-black text-lg tracking-tighter leading-none">buyza</h1>
            <p className="text-[8px] text-slate-500 uppercase tracking-[0.2em] font-bold mt-1">Smart Marketplace</p>
          </div>
        </div>
        <div className="hidden lg:flex mt-4 px-1 py-1 bg-slate-800/50 rounded-lg border border-slate-700/50 items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">HotelloSys v1.13</span>
        </div>
      </div>

      <nav className="flex-1 px-2 lg:px-4 py-4 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => item.enabled && setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl transition-all duration-200 group relative justify-center lg:justify-start ${
              activeTab === item.id 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/20' 
                : 'hover:bg-slate-800 hover:text-slate-200'
            } ${!item.enabled ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
          >
            <i className={`fa-solid ${item.icon} w-5 text-center text-lg lg:text-base ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}></i>
            <span className="hidden lg:block font-bold text-sm truncate">{item.label}</span>
            {!item.enabled && (
              <i className="hidden lg:block fa-solid fa-lock absolute right-4 text-[10px] opacity-40"></i>
            )}
          </button>
        ))}
      </nav>

      <div className="p-2 lg:p-6 border-t border-slate-800">
        <div className="bg-slate-800/40 p-2 lg:p-4 rounded-2xl border border-slate-700/30">
          <div className="hidden lg:flex justify-between items-center mb-3">
            <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest">Security Token</p>
            <span className="text-green-500 text-[8px] font-black uppercase flex items-center gap-1">
              <i className="fa-solid fa-shield-check"></i> Verified
            </span>
          </div>
          <div className="flex items-center gap-3 justify-center lg:justify-start">
            <div className="relative shrink-0">
              <img src={user?.avatar || "https://picsum.photos/seed/admin/100"} className="w-10 h-10 rounded-xl ring-2 ring-slate-700" alt="User" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full"></div>
            </div>
            <div className="hidden lg:block overflow-hidden">
              <p className="text-xs font-black text-white truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[9px] text-blue-400 font-bold uppercase tracking-tight">{user?.role || 'System Root'}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
