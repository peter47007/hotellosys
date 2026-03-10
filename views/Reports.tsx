
import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie, LineChart, Line, ComposedChart 
} from 'recharts';
import { 
  calculateOccupancyReport, 
  generateRevenueForecast, 
  getOperationalMetrics 
} from '../services/reportingService';
import { exportReportData, ExportFormat } from '../services/exportService';

const analyticsData = [
  { name: 'Mon', revenue: 4200, occupancy: 65, adr: 120, revpar: 78 },
  { name: 'Tue', revenue: 3800, occupancy: 58, adr: 125, revpar: 72 },
  { name: 'Wed', revenue: 2900, occupancy: 45, adr: 118, revpar: 53 },
  { name: 'Thu', revenue: 4100, occupancy: 62, adr: 130, revpar: 80 },
  { name: 'Fri', revenue: 5600, occupancy: 85, adr: 145, revpar: 123 },
  { name: 'Sat', revenue: 6800, occupancy: 95, adr: 160, revpar: 152 },
  { name: 'Sun', revenue: 5200, occupancy: 78, adr: 140, revpar: 109 },
];

const channelData = [
  { name: 'Direct Web', value: 45, color: '#3b82f6' },
  { name: 'OTA (Booking)', value: 30, color: '#10b981' },
  { name: 'Buyza Mobile', value: 25, color: '#f59e0b' },
];

const ReportsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'revenue' | 'occupancy' | 'operations' | 'forecast'>('revenue');
  const [isExporting, setIsExporting] = useState(false);
  
  const metrics = useMemo(() => getOperationalMetrics(), []);
  const forecast = useMemo(() => generateRevenueForecast([4200, 3800, 2900, 4100, 5600, 6800, 5200], 14), []);

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    const success = await exportReportData(analyticsData, `HotelloSys_${activeTab}_Report`, format);
    setIsExporting(false);
    if (success) {
      // Could trigger a toast here
    }
  };

  const renderKPI = (label: string, value: string, sub: string, icon: string, color: string) => (
    <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative group hover:shadow-lg transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${color} shadow-lg shadow-current/20`}>
          <i className={`fa-solid ${icon}`}></i>
        </div>
        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg">Healthy</span>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <h3 className="text-3xl font-black text-slate-900 mt-1">{value}</h3>
      <p className="text-xs text-slate-400 font-bold mt-1">{sub}</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Intelligence Hub</h3>
          <p className="text-slate-500 text-sm font-medium">Real-time property-wide business intelligence and predictive modeling.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm flex">
             {[
               { id: 'revenue', label: 'Revenue', icon: 'fa-dollar-sign' },
               { id: 'occupancy', label: 'Occupancy', icon: 'fa-bed' },
               { id: 'operations', label: 'Efficiency', icon: 'fa-bolt-lightning' },
               { id: 'forecast', label: 'Future Pulse', icon: 'fa-crystal-ball' }
             ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${
                   activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                 }`}
               >
                 <i className={`fa-solid ${tab.icon}`}></i>
                 {tab.label}
               </button>
             ))}
           </div>
           
           <div className="relative group">
              <button className={`h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all ${isExporting ? 'animate-pulse' : ''}`}>
                 {isExporting ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-download"></i>}
              </button>
              <div className="absolute right-0 top-14 w-48 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 invisible group-hover:visible z-50 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                 <button onClick={() => handleExport(ExportFormat.PDF)} className="w-full text-left px-4 py-2 hover:bg-slate-50 rounded-xl text-xs font-black uppercase text-slate-600 flex items-center gap-3">
                   <i className="fa-solid fa-file-pdf text-red-500"></i> Export PDF
                 </button>
                 <button onClick={() => handleExport(ExportFormat.EXCEL)} className="w-full text-left px-4 py-2 hover:bg-slate-50 rounded-xl text-xs font-black uppercase text-slate-600 flex items-center gap-3">
                   <i className="fa-solid fa-file-excel text-emerald-500"></i> Export Excel
                 </button>
                 <button onClick={() => handleExport(ExportFormat.CSV)} className="w-full text-left px-4 py-2 hover:bg-slate-50 rounded-xl text-xs font-black uppercase text-slate-600 flex items-center gap-3">
                   <i className="fa-solid fa-file-csv text-blue-500"></i> Export CSV
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Management Alerts (New Component from Phase 8 Guide) */}
      <div className="bg-amber-50 border border-amber-100 p-6 rounded-[32px] flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
               <i className="fa-solid fa-triangle-exclamation text-xl"></i>
            </div>
            <div>
               <h4 className="font-black text-amber-900 text-sm">Critical Efficiency Warning</h4>
               <p className="text-amber-700/70 text-xs font-bold">Average Cleaning Time in Wing B has increased by 15% this week. Investigate resource allocation.</p>
            </div>
         </div>
         <button className="px-6 py-2.5 bg-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-600/20 hover:bg-amber-700 transition-all">
            Resolve Alert
         </button>
      </div>

      {activeTab === 'revenue' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {renderKPI('Total Period Revenue', '$32,600', '+12.4% vs Last Week', 'fa-vault', 'bg-blue-600')}
            {renderKPI('ADR', '$132', 'Average Daily Rate', 'fa-tags', 'bg-indigo-600')}
            {renderKPI('RevPAR', '$84', 'Rev per Avail Room', 'fa-chart-line', 'bg-emerald-600')}
            {renderKPI('F&B Revenue', '$8,450', '26% of Total', 'fa-utensils', 'bg-amber-600')}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center mb-10">
                <h4 className="font-black text-slate-900 text-xl">Revenue Streams Breakdown</h4>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      <span className="text-[10px] font-black text-slate-500 uppercase">Gross Sales</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                      <span className="text-[10px] font-black text-slate-500 uppercase">ADR Curve</span>
                   </div>
                </div>
              </div>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                   <ComposedChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                      />
                      <Bar dataKey="revenue" fill="#3b82f6" radius={[10, 10, 0, 0]} barSize={40} />
                      <Line type="monotone" dataKey="adr" stroke="#f59e0b" strokeWidth={4} dot={{ r: 4, fill: '#f59e0b' }} />
                   </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-950 p-10 rounded-[48px] text-white flex flex-col justify-between shadow-2xl">
              <div>
                <h4 className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Channel Performance</h4>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={channelData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" animationBegin={0} animationDuration={1500}>
                        {channelData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4 mt-8">
                  {channelData.map(channel => (
                    <div key={channel.name} className="flex justify-between items-center group cursor-default">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full transition-transform group-hover:scale-150" style={{ backgroundColor: channel.color }}></div>
                        <span className="text-sm font-bold opacity-70">{channel.name}</span>
                      </div>
                      <span className="font-black text-white">{channel.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-6 border-t border-white/10">
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">Data refreshed 2m ago</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'occupancy' && (
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm relative">
             <div className="flex justify-between items-center mb-10">
                <h4 className="font-black text-slate-900 text-xl">Occupancy Trends & Peak Detection</h4>
                <div className="flex gap-4">
                   <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      <span className="text-[10px] font-black text-slate-500 uppercase">Current week</span>
                   </div>
                </div>
             </div>
             <div className="h-[450px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData}>
                    <defs>
                      <linearGradient id="occGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                    <Tooltip 
                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                    />
                    <Area type="monotone" dataKey="occupancy" stroke="#3b82f6" strokeWidth={5} fill="url(#occGradient)" dot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'operations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm text-center group hover:border-blue-200 transition-all">
             <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Housekeeping Efficiency</h5>
             <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="88" fill="transparent" stroke="#f1f5f9" strokeWidth="16" />
                  <circle cx="96" cy="96" r="88" fill="transparent" stroke="#10b981" strokeWidth="16" 
                    strokeDasharray={552.9} strokeDashoffset={552.9 * (1 - metrics.housekeepingEfficiency/100)} 
                    strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <span className="text-4xl font-black text-slate-900">{metrics.housekeepingEfficiency}%</span>
                   <span className="text-[8px] font-black text-slate-400 uppercase">On Target</span>
                </div>
             </div>
             <p className="text-xs text-slate-500 font-bold">Avg Cleaning Time: <span className="text-slate-900">{metrics.avgCleaningTime}m</span></p>
          </div>

          <div className="bg-slate-900 p-10 rounded-[48px] shadow-2xl text-white flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12">
               <i className="fa-solid fa-star text-[8rem]"></i>
             </div>
             <div className="relative z-10">
                <h5 className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-8">Guest Satisfaction (CSAT)</h5>
                <p className="text-8xl font-black mb-2 tracking-tighter">{metrics.guestSatisfaction}</p>
                <div className="flex gap-2 text-amber-400 text-2xl mb-6">
                   {[...Array(5)].map((_, i) => <i key={i} className="fa-solid fa-star animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></i>)}
                </div>
             </div>
             <p className="text-slate-400 text-xs leading-relaxed font-medium">Top Review: <span className="text-white italic">"Impeccable service and streamlined check-in process."</span></p>
          </div>

          <div className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm">
             <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Front Desk Velocity</h5>
             <div className="space-y-8">
                <div>
                   <div className="flex justify-between text-xs font-bold mb-3">
                      <span className="text-slate-500">Avg Check-in Time</span>
                      <span className="text-blue-600 font-black">{metrics.checkInSpeed}m</span>
                   </div>
                   <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: '85%' }}></div>
                   </div>
                </div>
                <div>
                   <div className="flex justify-between text-xs font-bold mb-3">
                      <span className="text-slate-500">Staff Present (Active Shift)</span>
                      <span className="text-emerald-600 font-black">{metrics.staffPresence} Members</span>
                   </div>
                   <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: '100%' }}></div>
                   </div>
                </div>
                <div className="pt-4">
                   <button className="w-full py-3 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-colors">View Staff Allocation</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'forecast' && (
        <div className="bg-white p-12 rounded-[56px] border border-slate-200 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12">
              <span className="px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-600/30">AI Model v4.2 Active</span>
           </div>
           <div className="mb-12">
              <h4 className="font-black text-slate-900 text-2xl tracking-tight">Future Pulse Analytics</h4>
              <p className="text-slate-500 text-sm font-medium mt-1">14-Day revenue and occupancy projection with confidence intervals.</p>
           </div>
           <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={forecast}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                    <Tooltip 
                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                    />
                    <Line type="monotone" dataKey="forecast" stroke="#3b82f6" strokeWidth={5} strokeDasharray="10 10" dot={{ r: 8, fill: '#3b82f6', strokeWidth: 4, stroke: '#fff' }} animationDuration={2000} />
                 </LineChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                 <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Projection Confidence</p>
                 <p className="text-2xl font-black text-blue-900">92.4%</p>
              </div>
              <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                 <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Expected Peak</p>
                 <p className="text-2xl font-black text-emerald-900">Friday, Oct 12</p>
              </div>
              <div className="p-6 bg-slate-900 rounded-3xl text-white">
                 <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Recommended Action</p>
                 <p className="text-sm font-bold">Increase F&B staff by 20% for forecasted weekend peak.</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ReportsView;
