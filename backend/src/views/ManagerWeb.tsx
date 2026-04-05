
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { time: '8am', rev: 1200 }, { time: '10am', rev: 2500 }, { time: '12pm', rev: 4100 }, 
  { time: '2pm', rev: 3800 }, { time: '4pm', rev: 5200 }, { time: '6pm', rev: 6800 }
];

const ManagerWeb: React.FC = () => {
  return (
    <div className="max-w-md mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="px-4">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Manager Remote</h3>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Real-time HQ Feed</p>
      </div>

      <div className="grid grid-cols-2 gap-4 px-4">
         <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Live ADR</p>
            <h4 className="text-2xl font-black text-slate-900">$142</h4>
            <span className="text-[9px] font-black text-emerald-500">+4.5%</span>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Occupancy</p>
            <h4 className="text-2xl font-black text-slate-900">88%</h4>
            <span className="text-[9px] font-black text-blue-500">Active</span>
         </div>
      </div>

      <div className="bg-slate-950 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden mx-4">
         <h4 className="font-black text-blue-400 text-[10px] uppercase tracking-widest mb-4">Intraday Revenue Pulse</h4>
         <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={data}>
                  <defs>
                     <linearGradient id="managerRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <Tooltip contentStyle={{ borderRadius: '16px', background: '#0f172a', border: 'none', color: '#fff' }} />
                  <Area type="monotone" dataKey="rev" stroke="#3b82f6" strokeWidth={3} fill="url(#managerRev)" />
               </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>

      <div className="px-4 space-y-4">
         <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Critical Alerts</h5>
         <div className="bg-red-50 border border-red-100 p-6 rounded-[32px] flex gap-4">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
               <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
               <p className="text-xs font-black text-red-900">Inventory Shortage</p>
               <p className="text-[10px] text-red-700 font-medium">Linen stock in Wing B below threshold (12 units remaining).</p>
            </div>
         </div>
         <div className="bg-amber-50 border border-amber-100 p-6 rounded-[32px] flex gap-4">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
               <i className="fa-solid fa-user-clock"></i>
            </div>
            <div>
               <p className="text-xs font-black text-amber-900">Staffing Alert</p>
               <p className="text-[10px] text-amber-700 font-medium">Shift coverage for Front Desk (Night) at 50% capacity.</p>
            </div>
         </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 flex gap-2">
         <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">Refresh Sync</button>
         <button className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-blue-600/20">
            <i className="fa-solid fa-plus"></i>
         </button>
      </div>
    </div>
  );
};

export default ManagerWeb;
