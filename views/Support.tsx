
import React, { useState } from 'react';

const TrainingGuides = [
  { id: 'g1', title: 'Front Desk Mastery', category: 'Reception', time: '15m', icon: 'fa-concierge-bell', progress: 100 },
  { id: 'g2', title: 'POS Inventory Sync', category: 'Restaurant', time: '10m', icon: 'fa-utensils', progress: 45 },
  { id: 'g3', title: 'Night Audit Procedures', category: 'Finance', time: '25m', icon: 'fa-moon', progress: 0 },
  { id: 'g4', title: 'Housekeeping Workflows', category: 'Operations', time: '12m', icon: 'fa-broom', progress: 0 },
];

const SupportView: React.FC = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Training & Knowledge Hub</h3>
          <p className="text-slate-500 text-sm font-medium">Empowering your team with HotelloSys certification and support.</p>
        </div>
        <div className="relative group w-full md:w-96">
           <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
           <input 
             type="text" 
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             placeholder="Search guides, tutorials, or docs..."
             className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
           />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-slate-950 p-10 rounded-[48px] text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
                 <i className="fa-solid fa-graduation-cap text-[10rem]"></i>
              </div>
              <div className="relative z-10">
                 <h4 className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Onboarding Progress</h4>
                 <div className="flex items-end gap-2 mb-8">
                    <span className="text-6xl font-black">24%</span>
                    <span className="text-slate-400 font-bold mb-2">Completion</span>
                 </div>
                 <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full w-[24%]"></div>
                 </div>
                 <p className="mt-6 text-slate-400 text-xs font-medium">Continue your <span className="text-white font-black">Finance Certification</span> to unlock manager dashboard features.</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {TrainingGuides.map(guide => (
                <div key={guide.id} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm hover:shadow-xl transition-all group cursor-pointer">
                   <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors shadow-inner">
                         <i className={`fa-solid ${guide.icon} text-xl`}></i>
                      </div>
                      {guide.progress === 100 && <i className="fa-solid fa-circle-check text-emerald-500 text-xl"></i>}
                   </div>
                   <h5 className="text-xl font-black text-slate-900 mb-1">{guide.title}</h5>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-6">{guide.category} • {guide.time}</p>
                   
                   <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${guide.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`} style={{ width: `${guide.progress}%` }}></div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
              <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-widest mb-8">Direct Assistance</h4>
              <div className="space-y-4">
                 <button className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl flex items-center gap-4 hover:bg-slate-100 transition-all text-left group">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                       <i className="fa-solid fa-headset"></i>
                    </div>
                    <div>
                       <p className="text-sm font-black text-slate-900">Live Support Chat</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase">Average response: 2m</p>
                    </div>
                 </button>
                 <button className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl flex items-center gap-4 hover:bg-slate-100 transition-all text-left group">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                       <i className="fa-solid fa-book"></i>
                    </div>
                    <div>
                       <p className="text-sm font-black text-slate-900">API Documentation</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase">v1.9 Reference</p>
                    </div>
                 </button>
                 <button className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl flex items-center gap-4 hover:bg-slate-100 transition-all text-left group">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-sm">
                       <i className="fa-solid fa-video"></i>
                    </div>
                    <div>
                       <p className="text-sm font-black text-slate-900">Video Tutorials</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase">Visual walk-throughs</p>
                    </div>
                 </button>
              </div>
           </div>

           <div className="bg-blue-600 p-8 rounded-[40px] text-white shadow-xl shadow-blue-600/20">
              <i className="fa-solid fa-star text-2xl mb-4"></i>
              <h4 className="text-xl font-black mb-2">HotelloSys Academy</h4>
              <p className="text-blue-100 text-xs font-medium leading-relaxed mb-6">Become a certified system administrator and master advanced automation tools.</p>
              <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-colors">Enroll Today</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SupportView;
