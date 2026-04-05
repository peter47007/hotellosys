
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

const latencyData = [
  { time: '12:00', ms: 42 }, { time: '12:05', ms: 38 }, { time: '12:10', ms: 45 },
  { time: '12:15', ms: 350 }, { time: '12:20', ms: 52 }, { time: '12:25', ms: 48 },
];

const SystemHealth: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Technical Operations</h3>
          <p className="text-slate-500 text-sm font-medium">Real-time infrastructure health and node connectivity monitoring.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
           <span className="text-[10px] font-black uppercase tracking-widest">Systems Nominal</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'API Latency', value: '42ms', status: 'Stable', icon: 'fa-microchip', color: 'text-blue-600' },
          { label: 'Cloud Sync', value: '100%', status: 'Active', icon: 'fa-cloud-arrow-up', color: 'text-emerald-600' },
          { label: 'DB Connections', value: '18', status: 'Optimal', icon: 'fa-database', color: 'text-purple-600' },
          { label: 'Backup Health', value: 'Secure', status: '1h ago', icon: 'fa-shield-check', color: 'text-amber-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden group">
             <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center ${stat.color} shadow-inner`}>
                   <i className={`fa-solid ${stat.icon}`}></i>
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase">{stat.status}</span>
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
             <h4 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-950 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden">
           <div className="flex justify-between items-center mb-10">
              <div>
                <h4 className="font-black text-xl">Latency Pulse (Global Edge)</h4>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Real-time gateway response time</p>
              </div>
              <div className="text-right">
                 <span className="text-xs font-black text-blue-400">Avg: 48ms</span>
              </div>
           </div>
           <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={latencyData}>
                    <defs>
                       <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="ms" stroke="#3b82f6" strokeWidth={4} fill="url(#latencyGrad)" dot={{ r: 4, fill: '#3b82f6' }} />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
              <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-widest mb-6">Service Status Ledger</h4>
              <div className="space-y-4">
                 {[
                   { name: 'Core API Gateway', status: 'Online' },
                   { name: 'Reservation Processor', status: 'Online' },
                   { name: 'POS Sync Engine', status: 'Online' },
                   { name: 'Email Dispatcher', status: 'Online' },
                   { name: 'Loyalty Calculator', status: 'Delayed', warning: true },
                 ].map(svc => (
                   <div key={svc.name} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-sm font-bold text-slate-700">{svc.name}</span>
                      <span className={`text-[10px] font-black uppercase ${svc.warning ? 'text-amber-500' : 'text-emerald-500'}`}>
                         {svc.status}
                      </span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
              <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-widest mb-6">System Maintenance</h4>
              <div className="grid grid-cols-2 gap-3">
                 <button className="py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex flex-col items-center justify-center gap-2">
                    <i className="fa-solid fa-cloud-arrow-down text-lg"></i>
                    Manual Backup
                 </button>
                 <button className="py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex flex-col items-center justify-center gap-2">
                    <i className="fa-solid fa-rotate text-lg text-blue-500"></i>
                    Flush Cache
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
