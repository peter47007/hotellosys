
import React, { useState } from 'react';
import { ComplianceItem } from '../types';

interface ComplianceCenterProps {
  items: ComplianceItem[];
  onToggleCompliance: (id: string) => void;
}

const ComplianceCenter: React.FC<ComplianceCenterProps> = ({ items, onToggleCompliance }) => {
  const [activeStandard, setActiveStandard] = useState<'PCI-DSS' | 'GDPR' | 'SOC2'>('PCI-DSS');

  const filtered = items.filter(i => i.standard === activeStandard);
  const compliantCount = filtered.filter(i => i.isCompliant).length;
  const progress = filtered.length > 0 ? (compliantCount / filtered.length) * 100 : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Compliance & Trust Center</h3>
          <p className="text-slate-500 text-sm font-medium">Verify adherence to global regulatory standards and security frameworks.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
          {['PCI-DSS', 'GDPR', 'SOC2'].map(std => (
            <button
              key={std}
              onClick={() => setActiveStandard(std as any)}
              className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeStandard === std ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {std}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">{activeStandard} Control Checklist</h4>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{compliantCount} of {filtered.length} Verified</span>
              </div>
              <div className="divide-y divide-slate-100">
                 {filtered.map(item => (
                   <div key={item.id} className="p-8 flex items-start justify-between group hover:bg-slate-50/50 transition-colors">
                      <div className="flex gap-6 max-w-xl">
                         <button 
                           onClick={() => onToggleCompliance(item.id)}
                           className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 mt-1 ${
                             item.isCompliant ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 text-transparent hover:border-blue-400'
                           }`}
                         >
                            <i className="fa-solid fa-check text-xs"></i>
                         </button>
                         <div>
                            <h5 className="font-bold text-slate-900 mb-1">{item.requirement}</h5>
                            <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                            {item.isCompliant && (
                              <div className="mt-4 flex items-center gap-3">
                                 <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                                    <i className="fa-solid fa-paperclip"></i> Evidence Attached
                                 </span>
                                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    Verified {item.lastChecked.toLocaleDateString()}
                                 </span>
                              </div>
                            )}
                         </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 shadow-sm">
                            <i className="fa-solid fa-upload text-xs"></i>
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm text-center">
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">{activeStandard} Readiness</h5>
              <div className="relative w-48 h-48 mx-auto mb-10">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="88" fill="transparent" stroke="#f1f5f9" strokeWidth="16" />
                    <circle 
                      cx="96" cy="96" r="88" fill="transparent" 
                      stroke={progress === 100 ? '#10b981' : '#3b82f6'} 
                      strokeWidth="16" 
                      strokeDasharray={552.9} 
                      strokeDashoffset={552.9 * (1 - progress/100)} 
                      strokeLinecap="round" 
                      className="transition-all duration-1000 ease-out" 
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-slate-900">{Math.round(progress)}%</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Compliant</span>
                 </div>
              </div>
              <button className="w-full py-5 bg-slate-900 text-white rounded-[28px] font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20">
                 Request External Audit
              </button>
           </div>

           <div className="bg-slate-950 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-10">
                 <i className="fa-solid fa-shield-halved text-[8rem]"></i>
              </div>
              <div className="relative z-10">
                 <h4 className="font-black text-blue-400 text-[10px] uppercase tracking-widest mb-4">Security Overview</h4>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold border-b border-white/10 pb-4">
                       <span className="opacity-60">System Version</span>
                       <span>v1.10.4 Final</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold border-b border-white/10 pb-4">
                       <span className="opacity-60">Database Integrity</span>
                       <span className="text-emerald-400">Verified</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold">
                       <span className="opacity-60">Last Security Scan</span>
                       <span>Today, 04:12 AM</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceCenter;
