
import React, { useState } from 'react';
import { DataSubjectRequest, DataSubjectRequestType, DataSubjectRequestStatus, Customer } from '../types';

interface GDPRManagerProps {
  requests: DataSubjectRequest[];
  customers: Customer[];
  onUpdateStatus: (id: string, status: DataSubjectRequestStatus) => void;
  onAnonymize: (customerId: string) => void;
  onExport: (customerId: string) => void;
}

const GDPRManager: React.FC<GDPRManagerProps> = ({ requests, customers, onUpdateStatus, onAnonymize, onExport }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  const filtered = requests.filter(r => 
    activeTab === 'pending' ? r.status !== DataSubjectRequestStatus.COMPLETED : r.status === DataSubjectRequestStatus.COMPLETED
  );

  const getGuestName = (id: string) => {
    const c = customers.find(cust => cust.id === id);
    return c ? `${c.firstName} ${c.lastName}` : 'Guest Not Found';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">GDPR & Data Rights</h3>
        <p className="text-slate-500 text-sm font-medium">Manage Right to be Forgotten, Data Access, and Portability requests.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm w-fit">
              <button 
                onClick={() => setActiveTab('pending')}
                className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === 'pending' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                }`}
              >Pending Action</button>
              <button 
                onClick={() => setActiveTab('completed')}
                className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === 'completed' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                }`}
              >Archive</button>
           </div>

           <div className="space-y-4">
              {filtered.map(req => (
                <div key={req.id} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all">
                   <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-white shadow-lg ${
                        req.type === DataSubjectRequestType.DELETION ? 'bg-red-500' : 'bg-blue-600'
                      }`}>
                         <i className={`fa-solid ${req.type === DataSubjectRequestType.DELETION ? 'fa-user-slash' : 'fa-file-export'} text-xl`}></i>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{req.requestNumber}</p>
                         <h4 className="text-xl font-black text-slate-900">{getGuestName(req.customerId)}</h4>
                         <p className="text-xs font-bold text-slate-500 mt-1">Requested {req.type.replace(/([A-Z])/g, ' $1').trim()}</p>
                      </div>
                   </div>
                   
                   <div className="flex gap-2">
                      {req.status !== DataSubjectRequestStatus.COMPLETED && (
                        <>
                          {req.type === DataSubjectRequestType.PORTABILITY && (
                            <button 
                              onClick={() => onExport(req.customerId)}
                              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20"
                            >Generate Bundle</button>
                          )}
                          {req.type === DataSubjectRequestType.DELETION && (
                            <button 
                              onClick={() => {
                                if(confirm('Are you sure? This will anonymize all records for this guest across all modules.')) {
                                  onAnonymize(req.customerId);
                                  onUpdateStatus(req.id, DataSubjectRequestStatus.COMPLETED);
                                }
                              }}
                              className="px-6 py-3 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-600/20"
                            >Execute Erasure</button>
                          )}
                          <button 
                            onClick={() => onUpdateStatus(req.id, DataSubjectRequestStatus.COMPLETED)}
                            className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center"
                          >
                             <i className="fa-solid fa-check"></i>
                          </button>
                        </>
                      )}
                      {req.status === DataSubjectRequestStatus.COMPLETED && (
                        <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                           <i className="fa-solid fa-circle-check"></i>
                           Finalized {req.completionDate?.toLocaleDateString()}
                        </div>
                      )}
                   </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] p-20 text-center">
                   <i className="fa-solid fa-shield-heart text-5xl text-slate-200 mb-4"></i>
                   <h5 className="font-bold text-slate-400 uppercase tracking-widest">All Guest Rights Up to Date</h5>
                </div>
              )}
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-slate-950 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
                 <i className="fa-solid fa-lock text-[8rem]"></i>
              </div>
              <div className="relative z-10">
                 <h4 className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">Retention Pulse</h4>
                 <div className="space-y-6">
                    <div>
                       <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                          <span>Audit Logs</span>
                          <span className="text-slate-400">90 Days</span>
                       </div>
                       <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 w-[80%]"></div>
                       </div>
                    </div>
                    <div>
                       <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                          <span>Guest Ledger</span>
                          <span className="text-slate-400">7 Years</span>
                       </div>
                       <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 w-[45%]"></div>
                       </div>
                    </div>
                    <button className="w-full mt-4 py-4 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5">Adjust Policies</button>
                 </div>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">GDPR Metrics</h5>
              <div className="space-y-4">
                 <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">Consent Rate</span>
                    <span className="text-lg font-black text-emerald-600">88.4%</span>
                 </div>
                 <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">Avg Response</span>
                    <span className="text-lg font-black text-blue-600">3.2 Days</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default GDPRManager;
