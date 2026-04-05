
import React, { useState } from 'react';
import { MobileAppStats, PushNotification, MobileDevice } from '../types';

interface MobileCommandProps {
  stats: MobileAppStats;
  notifications: PushNotification[];
  devices: MobileDevice[];
  onSendNotification: (notif: Partial<PushNotification>) => void;
}

const MobileCommand: React.FC<MobileCommandProps> = ({ stats, notifications, devices, onSendNotification }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'notifications' | 'devices'>('overview');
  const [newNotif, setNewNotif] = useState({ title: '', body: '', target: 'All' as any });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Mobile App Console</h3>
          <p className="text-slate-500 text-sm font-medium">Headless API status and Phase 13 mobile ecosystem management.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Ecosystem Pulse', icon: 'fa-chart-network' },
            { id: 'notifications', label: 'Push Center', icon: 'fa-paper-plane' },
            { id: 'devices', label: 'Device Registry', icon: 'fa-mobile-screen' }
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
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Active Installs', value: stats.activeInstalls.toLocaleString(), trend: '+12%', icon: 'fa-download', color: 'bg-blue-600' },
                { label: 'Mobile Revenue', value: `$${stats.revenueFromMobile.toLocaleString()}`, trend: '+8.4%', icon: 'fa-money-bill-trend-up', color: 'bg-emerald-600' },
                { label: 'Conversion', value: `${stats.conversionRate}%`, trend: 'Stable', icon: 'fa-bullseye-arrow', color: 'bg-purple-600' },
                { label: 'API Latency', value: '42ms', trend: 'Optimal', icon: 'fa-bolt', color: 'bg-amber-600' },
              ].map(stat => (
                <div key={stat.label} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm group hover:shadow-xl transition-all">
                   <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${stat.color} shadow-lg shadow-current/20`}>
                         <i className={`fa-solid ${stat.icon}`}></i>
                      </div>
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{stat.trend}</span>
                   </div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                   <h4 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h4>
                </div>
              ))}
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-slate-950 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12">
                    <i className="fa-solid fa-signal-stream text-[12rem]"></i>
                 </div>
                 <div className="relative z-10">
                    <div className="flex justify-between items-center mb-10">
                       <div>
                          <h4 className="font-black text-2xl">Platform Distribution</h4>
                          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Global OS Utilization</p>
                       </div>
                       <div className="flex gap-4">
                          <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                             <span className="text-[10px] font-black text-slate-400 uppercase">iOS ({stats.iosPercentage}%)</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                             <span className="text-[10px] font-black text-slate-400 uppercase">Android ({stats.androidPercentage}%)</span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex h-12 w-full rounded-2xl overflow-hidden shadow-inner bg-white/10">
                       <div className="bg-blue-500 transition-all duration-1000" style={{ width: `${stats.iosPercentage}%` }}></div>
                       <div className="bg-emerald-500 transition-all duration-1000" style={{ width: `${stats.androidPercentage}%` }}></div>
                    </div>

                    <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                       <div>
                          <p className="text-xs font-black text-blue-400 uppercase mb-2">App Store Rating</p>
                          <div className="flex items-center gap-2">
                             <span className="text-3xl font-black">4.8</span>
                             <div className="flex text-amber-400 text-xs">
                                {[...Array(5)].map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}
                             </div>
                          </div>
                       </div>
                       <div>
                          <p className="text-xs font-black text-emerald-400 uppercase mb-2">Play Store Rating</p>
                          <div className="flex items-center gap-2">
                             <span className="text-3xl font-black">4.7</span>
                             <div className="flex text-amber-400 text-xs">
                                {[...Array(5)].map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm flex flex-col justify-between">
                 <div>
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Build Status (v1.13.0)</h5>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-3">
                             <i className="fa-brands fa-apple text-xl text-slate-400"></i>
                             <span className="text-sm font-bold text-slate-700">App Store</span>
                          </div>
                          <span className="text-[9px] font-black uppercase text-emerald-600">Live</span>
                       </div>
                       <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-3">
                             <i className="fa-brands fa-google-play text-xl text-slate-400"></i>
                             <span className="text-sm font-bold text-slate-700">Google Play</span>
                          </div>
                          <span className="text-[9px] font-black uppercase text-emerald-600">Live</span>
                       </div>
                    </div>
                 </div>
                 <button className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10">
                    Release Management
                 </button>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-1 bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm h-fit">
              <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-8">Compose Broadcast</h4>
              <div className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Notification Title</label>
                    <input 
                      type="text" 
                      value={newNotif.title}
                      onChange={(e) => setNewNotif({...newNotif, title: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold" 
                      placeholder="e.g. Welcome to Hotello!"
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Message Content</label>
                    <textarea 
                      value={newNotif.body}
                      onChange={(e) => setNewNotif({...newNotif, body: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-medium text-sm resize-none" 
                      rows={4}
                      placeholder="Enter the alert body..."
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Audience Targeting</label>
                    <select 
                       value={newNotif.target}
                       onChange={(e) => setNewNotif({...newNotif, target: e.target.value})}
                       className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold"
                    >
                       <option value="All">Global (All Devices)</option>
                       <option value="CheckedIn">Checked-In Guests Only</option>
                       <option value="VIP">Platinum/Gold Members</option>
                    </select>
                 </div>
                 <button 
                   onClick={() => {
                     onSendNotification(newNotif);
                     setNewNotif({ title: '', body: '', target: 'All' });
                   }}
                   className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all"
                 >
                    Blast Notification
                 </button>
              </div>
           </div>

           <div className="lg:col-span-2 space-y-6">
              <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest ml-1">Dispatch History</h4>
              {notifications.map(notif => (
                <div key={notif.id} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex items-center justify-between group hover:shadow-lg transition-all">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                         <i className="fa-solid fa-bullhorn text-xl"></i>
                      </div>
                      <div>
                         <h5 className="font-black text-slate-900">{notif.title}</h5>
                         <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{notif.body}</p>
                         <div className="flex items-center gap-3 mt-2">
                            <span className="text-[9px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">To: {notif.target}</span>
                            <span className="text-[9px] font-black uppercase text-slate-400">{new Date(notif.sentAt).toLocaleString()}</span>
                         </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-sm font-black text-slate-900">{notif.clicks}</div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Interactions</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'devices' && (
        <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
           <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">Live Mobile Node Registry</h4>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{devices.length} Handsets Synchronized</span>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                       <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Device Handset</th>
                       <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">OS Platform</th>
                       <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Owner ID</th>
                       <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Last Active</th>
                       <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">API Key</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {devices.map(device => (
                       <tr key={device.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="px-8 py-5">
                             <div className="flex items-center gap-3">
                                <i className={`fa-solid ${device.platform === 'iOS' ? 'fa-apple' : 'fa-android'} text-sm text-slate-400`}></i>
                                <span className="font-bold text-slate-900">{device.model}</span>
                             </div>
                          </td>
                          <td className="px-8 py-5">
                             <span className={`px-2 py-0.5 rounded-lg font-black uppercase tracking-widest ${
                               device.platform === 'iOS' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                             }`}>{device.platform}</span>
                          </td>
                          <td className="px-8 py-5 text-slate-500">#{device.customerId}</td>
                          <td className="px-8 py-5 text-slate-400">{device.lastActive.toLocaleString()}</td>
                          <td className="px-8 py-5 text-right">
                             <code className="bg-slate-100 px-2 py-1 rounded text-slate-400">...{device.pushToken.slice(-6)}</code>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}
    </div>
  );
};

export default MobileCommand;
