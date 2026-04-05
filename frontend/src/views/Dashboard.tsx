
import React, { useState, useEffect } from 'react';
import { Room, RoomStatus, ActivityLog, UserRole, HotelProperty } from '../types';
import { getHotelInsights } from '../services/gemini.service';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  rooms: Room[];
  activities: ActivityLog[];
  userRole: UserRole;
  properties: HotelProperty[];
  isRoot?: boolean;
  setActiveTab: (tab: string) => void;
}

const revenueData = [
  { name: 'Mon', revenue: 4200, systemHealth: 99 },
  { name: 'Tue', revenue: 3800, systemHealth: 100 },
  { name: 'Wed', revenue: 2900, systemHealth: 98 },
  { name: 'Thu', revenue: 4100, systemHealth: 99 },
  { name: 'Fri', revenue: 5600, systemHealth: 100 },
  { name: 'Sat', revenue: 6800, systemHealth: 100 },
  { name: 'Sun', revenue: 5200, systemHealth: 99 },
];

const Dashboard: React.FC<DashboardProps> = ({ rooms, activities, userRole, properties, isRoot, setActiveTab }) => {
  const [insights, setInsights] = useState<string>('Synthesizing role-specific performance data...');
  const [loadingInsights, setLoadingInsights] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoadingInsights(true);
      const metrics = { 
        occupancy: 75, 
        revenue: 4500, 
        pendingOrders: 12, 
        lowStockCount: 4, 
        topService: isRoot ? 'Enterprise Wide' : 'Beach Bar' 
      };
      const result = await getHotelInsights(metrics);
      setInsights(result);
      setLoadingInsights(false);
    };
    fetchInsights();
  }, [isRoot]);

  // 1. PROVIDER ROOT LAYOUT
  if (isRoot) {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="bg-slate-950 p-12 rounded-[56px] text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-10">
              <i className="fa-solid fa-crown text-[15rem]"></i>
           </div>
           <div className="relative z-10">
              <h1 className="text-5xl font-black mb-2 tracking-tighter">Global Command Deck</h1>
              <p className="text-blue-400 text-sm font-black uppercase tracking-[0.3em] mb-12">Provider Node: buyza_root_admin</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="bg-white/5 p-8 rounded-[40px] border border-white/10">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Network Health</p>
                    <h3 className="text-4xl font-black text-emerald-400">100%</h3>
                    <p className="text-xs text-slate-400 mt-2">All 14 active property nodes are online.</p>
                 </div>
                 <div className="bg-white/5 p-8 rounded-[40px] border border-white/10">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Total MRR</p>
                    <h3 className="text-4xl font-black text-white">$42,850</h3>
                    <p className="text-xs text-slate-400 mt-2">Current Monthly Recurring Revenue.</p>
                 </div>
                 <div className="bg-white/5 p-8 rounded-[40px] border border-white/10">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Pending Invoices</p>
                    <h3 className="text-4xl font-black text-amber-400">03</h3>
                    <p className="text-xs text-slate-400 mt-2">License renewals due in 48 hours.</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm">
              <h4 className="font-black text-slate-900 text-xl mb-8">System Usage Pulse</h4>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="rootChart" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={5} fill="url(#rootChart)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>
           
           <div className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm">
              <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-widest mb-8">Provider Quick-Actions</h4>
              <div className="space-y-4">
                 <button onClick={() => setActiveTab('settings')} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">Generate Master Key</button>
                 <button onClick={() => setActiveTab('audit_vault')} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all">Audit System Logs</button>
                 <button onClick={() => setActiveTab('settings')} className="w-full py-5 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Update Pricing Model</button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // 2. MANAGER / ADMIN LAYOUT
  if (userRole === 'Admin' || userRole === 'HotelOwner') {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex justify-between items-end">
           <div>
              <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Manager Overview</p>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Property Intelligence</h1>
           </div>
           <div className="flex gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
              <button onClick={() => setActiveTab('system_health')} className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Live Feed</button>
              <button onClick={() => setActiveTab('reports')} className="px-6 py-2 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest">Historical</button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[
             { label: 'Occupancy', val: '82%', icon: 'fa-bed', col: 'bg-emerald-600' },
             { label: 'Daily Rev', val: '$5.4k', icon: 'fa-chart-pie', col: 'bg-blue-600' },
             { label: 'Guest SAT', val: '4.8', icon: 'fa-face-smile', col: 'bg-indigo-600' },
             { label: 'Folio Bal', val: '$1.2k', icon: 'fa-wallet', col: 'bg-rose-600' }
           ].map(stat => (
             <div key={stat.label} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                <div className={`${stat.col} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg`}><i className={`fa-solid ${stat.icon}`}></i></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <h4 className="text-3xl font-black text-slate-900 mt-1">{stat.val}</h4>
             </div>
           ))}
        </div>

        <div className="bg-slate-950 p-10 rounded-[48px] text-white flex items-center justify-between">
           <div className="flex-1">
              <h4 className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">Butler AI Performance Insights</h4>
              {loadingInsights ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-4 bg-white/10 rounded w-full"></div>
                  <div className="h-4 bg-white/10 rounded w-2/3"></div>
                </div>
              ) : (
                <p className="text-xl font-bold italic leading-relaxed">"{insights}"</p>
              )}
           </div>
           <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-3xl shrink-0 ml-10">
              <i className="fa-solid fa-wand-magic-sparkles"></i>
           </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm">
              <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-widest mb-6">Quick Navigation</h4>
              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => setActiveTab('rooms')} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col items-center gap-3 hover:bg-blue-50 hover:border-blue-100 transition-all group">
                    <i className="fa-solid fa-door-open text-2xl text-slate-300 group-hover:text-blue-600 transition-colors"></i>
                    <span className="text-[10px] font-black uppercase text-slate-500">Rooms</span>
                 </button>
                 <button onClick={() => setActiveTab('reservations')} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col items-center gap-3 hover:bg-blue-50 hover:border-blue-100 transition-all group">
                    <i className="fa-solid fa-calendar-check text-2xl text-slate-300 group-hover:text-blue-600 transition-colors"></i>
                    <span className="text-[10px] font-black uppercase text-slate-500">Bookings</span>
                 </button>
                 <button onClick={() => setActiveTab('billing')} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col items-center gap-3 hover:bg-blue-50 hover:border-blue-100 transition-all group">
                    <i className="fa-solid fa-file-invoice-dollar text-2xl text-slate-300 group-hover:text-blue-600 transition-colors"></i>
                    <span className="text-[10px] font-black uppercase text-slate-500">Billing</span>
                 </button>
                 <button onClick={() => setActiveTab('staff_mobile')} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col items-center gap-3 hover:bg-blue-50 hover:border-blue-100 transition-all group">
                    <i className="fa-solid fa-mobile-screen text-2xl text-slate-300 group-hover:text-blue-600 transition-colors"></i>
                    <span className="text-[10px] font-black uppercase text-slate-500">Staff Hub</span>
                 </button>
              </div>
           </div>
           
           <div className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
              <i className="fa-solid fa-shield-halved text-6xl text-slate-100 mb-6"></i>
              <h4 className="font-black text-slate-900 text-lg">Compliance Center</h4>
              <p className="text-slate-500 text-sm mt-2 mb-8 max-w-xs">Your node is currently PCI-DSS and GDPR compliant. No pending audits.</p>
              <button onClick={() => setActiveTab('compliance')} className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">Verify Status</button>
           </div>
        </section>
      </div>
    );
  }

  // 3. STAFF / CHEF GENERIC DASHBOARD (Fall-back)
  return (
    <div className="flex items-center justify-center h-[70vh]">
       <div className="text-center">
          <i className="fa-solid fa-mobile-button text-6xl text-slate-200 mb-6"></i>
          <h2 className="text-2xl font-black text-slate-900">Mobile Terminal Hub Active</h2>
          <p className="text-slate-500 max-w-xs mt-2 mx-auto">Please use the mobile controls for daily operations and service requests.</p>
       </div>
    </div>
  );
};

export default Dashboard;
