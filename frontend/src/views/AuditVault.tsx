
import React, { useState } from 'react';
import { SystemAuditLog, EventSeverity } from '../types';

interface AuditVaultProps {
  logs: SystemAuditLog[];
}

const AuditVault: React.FC<AuditVaultProps> = ({ logs }) => {
  const [filter, setFilter] = useState<EventSeverity | 'All'>('All');
  const [search, setSearch] = useState('');

  const filtered = logs.filter(log => {
    const matchesFilter = filter === 'All' || log.severity === filter;
    const matchesSearch = log.action.toLowerCase().includes(search.toLowerCase()) || 
                          log.entityType.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getSeverityStyle = (sev: EventSeverity) => {
    switch (sev) {
      case EventSeverity.CRITICAL: return 'bg-red-500 text-white';
      case EventSeverity.ERROR: return 'bg-orange-500 text-white';
      case EventSeverity.WARNING: return 'bg-amber-400 text-slate-900';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">System Audit Vault</h3>
          <p className="text-slate-500 text-sm font-medium">Immutable record of all system interactions and data mutations.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm flex overflow-x-auto no-scrollbar">
             {['All', ...Object.values(EventSeverity)].map(sev => (
               <button
                 key={sev}
                 onClick={() => setFilter(sev as any)}
                 className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                   filter === sev ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'
                 }`}
               >
                 {sev}
               </button>
             ))}
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
           <div className="relative w-full max-w-md">
              <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search action or entity..."
                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold"
              />
           </div>
           <button className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3">
              <i className="fa-solid fa-download"></i>
              Export Forensic Archive
           </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Actor</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Target</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Severity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {filtered.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-5 text-slate-500">
                    {log.timestamp.toLocaleString()}
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-bold text-slate-900">ID-{log.employeeId || 'SYS'}</span>
                    <p className="text-[10px] text-slate-400">{log.ipAddress}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-black text-slate-900 uppercase tracking-tighter">{log.action}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-blue-600 font-bold">{log.entityType}</span>
                    <p className="text-[10px] text-slate-400">#{log.entityId}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${getSeverityStyle(log.severity)}`}>
                       {log.severity}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                       <i className="fa-solid fa-code text-xs"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                   <td colSpan={6} className="px-8 py-20 text-center text-slate-300 italic">No audit records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditVault;
