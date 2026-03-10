
import React, { useState } from 'react';
import { 
  Campaign, 
  CampaignStatus, 
  SalesLead, 
  LeadStatus, 
  LoyaltyTier, 
  Customer, 
  CustomerSegment,
  LoyaltyReward,
  RewardType,
  CommunicationLog,
  CustomerPreference
} from '../types';

interface MarketingViewProps {
  campaigns: Campaign[];
  leads: SalesLead[];
  tiers: LoyaltyTier[];
  customers: Customer[];
  segments: CustomerSegment[];
  rewards: LoyaltyReward[];
  commLogs: CommunicationLog[];
  preferences: CustomerPreference[];
}

const MarketingView: React.FC<MarketingViewProps> = ({ 
  campaigns, 
  leads, 
  tiers, 
  customers, 
  segments,
  rewards,
  commLogs,
  preferences
}) => {
  const [activeTab, setActiveTab] = useState<'loyalty' | 'campaigns' | 'segments' | 'sales' | 'ledger'>('loyalty');
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);

  const getTierGradient = (color: string) => {
    switch(color) {
      case 'bronze': return 'from-orange-400 to-orange-700';
      case 'silver': return 'from-slate-300 to-slate-500';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'platinum': return 'from-cyan-300 to-blue-500';
      default: return 'from-slate-400 to-slate-600';
    }
  };

  const renderGuestGenome = (guestId: string) => {
    const guest = customers.find(c => c.id === guestId);
    const pref = preferences.find(p => p.customerId === guestId);
    const logs = commLogs.filter(l => l.customerId === guestId);

    return (
      <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-[150] animate-in slide-in-from-right duration-500 flex flex-col">
        <div className="p-10 bg-slate-950 text-white flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-blue-600 rounded-[28px] flex items-center justify-center text-2xl font-black shadow-2xl">
              {guest?.firstName[0]}{guest?.lastName[0]}
            </div>
            <div>
              <h3 className="text-3xl font-black">{guest?.firstName} {guest?.lastName}</h3>
              <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Guest ID: {guest?.id}</p>
            </div>
          </div>
          <button onClick={() => setSelectedGuestId(null)} className="text-slate-500 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark text-2xl"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          <section className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Guest Genome & Preferences</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Favorite Floor</p>
                <p className="text-lg font-bold text-slate-900">{pref?.preferredFloor || 'No Preference'} Floor</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Room Style</p>
                <p className="text-lg font-bold text-slate-900">{pref?.preferredRoomType || 'Standard'}</p>
              </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase mb-4">Dietary Restrictions</p>
              <div className="flex flex-wrap gap-2">
                {pref?.dietaryRestrictions?.map(d => (
                  <span key={d} className="px-3 py-1.5 bg-white rounded-xl text-xs font-bold text-slate-700 border border-slate-200">{d}</span>
                )) || <span className="text-slate-400 text-xs italic">None documented</span>}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Communication History</h4>
            <div className="space-y-4 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-px before:bg-slate-100">
              {logs.map(log => (
                <div key={log.id} className="relative flex gap-6 items-start pl-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center relative z-10 shadow-sm ${
                    log.type === 'Email' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    <i className={`fa-solid ${log.type === 'Email' ? 'fa-envelope' : 'fa-phone'} text-sm`}></i>
                  </div>
                  <div className="flex-1 bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="font-bold text-slate-900 text-sm">{log.subject}</h5>
                      <span className="text-[9px] font-black text-slate-300">{new Date(log.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{log.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900">CRM & Growth Hub</h3>
          <p className="text-slate-500 text-sm">Customer lifecycle management, loyalty programs, and high-conversion marketing.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto custom-scrollbar">
          {[
            { id: 'loyalty', label: 'Loyalty', icon: 'fa-crown' },
            { id: 'segments', label: 'Segments', icon: 'fa-users-viewfinder' },
            { id: 'campaigns', label: 'Campaigns', icon: 'fa-bullhorn' },
            { id: 'sales', label: 'Pipeline', icon: 'fa-briefcase' },
            { id: 'ledger', label: 'Comm Ledger', icon: 'fa-receipt' }
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

      {activeTab === 'loyalty' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map(tier => (
              <div key={tier.id} className="relative group overflow-hidden bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm hover:shadow-xl transition-all">
                <div className={`absolute top-0 right-0 w-2 h-full bg-gradient-to-b ${getTierGradient(tier.color)}`}></div>
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${getTierGradient(tier.color)} flex items-center justify-center text-white shadow-lg`}>
                    <i className="fa-solid fa-gem"></i>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tier.threshold}+ Points</span>
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-1">{tier.name}</h4>
                <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6">{tier.pointsMultiplier}x Points Multiplier</p>
                <div className="space-y-2">
                   {tier.perks.map((perk, i) => (
                     <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <i className="fa-solid fa-circle-check text-[10px] text-emerald-500"></i>
                        <span>{perk}</span>
                     </div>
                   ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">Active Members</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Member</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Tier Status</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Balance</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {customers.map(guest => {
                        const tier = tiers.find(t => t.id === guest.loyaltyTierId);
                        return (
                          <tr key={guest.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-8 py-5">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 ring-2 ring-white">
                                    {guest.firstName[0]}{guest.lastName[0]}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-bold text-slate-900 leading-none">{guest.firstName} {guest.lastName}</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">{guest.email}</span>
                                  </div>
                               </div>
                            </td>
                            <td className="px-8 py-5">
                               <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-gradient-to-r ${getTierGradient(tier?.color || 'slate')} text-white shadow-sm`}>
                                 {tier?.name || 'Standard'}
                               </span>
                            </td>
                            <td className="px-8 py-5">
                               <div className="flex items-center gap-2">
                                  <i className="fa-solid fa-star text-amber-400 text-xs"></i>
                                  <span className="font-black text-slate-900">{guest.loyaltyPoints.toLocaleString()}</span>
                               </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                               <button 
                                onClick={() => setSelectedGuestId(guest.id)}
                                className="text-blue-600 text-[10px] font-black uppercase hover:underline"
                               >Open Genome</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
             </div>

             <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
                <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-6">Rewards Boutique</h4>
                <div className="space-y-4">
                  {rewards.map(reward => (
                    <div key={reward.id} className="p-5 rounded-3xl border border-slate-100 bg-slate-50/50 hover:border-blue-200 transition-all flex justify-between items-center group">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                            <i className={`fa-solid ${reward.type === RewardType.UPGRADE ? 'fa-arrow-up-right-dots' : 'fa-gift'}`}></i>
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{reward.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{reward.pointsRequired} Points Required</p>
                          </div>
                       </div>
                       <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all">
                          <i className="fa-solid fa-angle-right"></i>
                       </button>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'segments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-950 p-10 rounded-[48px] text-white flex flex-col justify-between min-h-[350px] group cursor-pointer hover:scale-[1.02] transition-all relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
               <i className="fa-solid fa-users-viewfinder text-[12rem]"></i>
             </div>
             <div className="relative z-10">
                <div className="w-14 h-14 bg-blue-600 rounded-[24px] flex items-center justify-center text-white mb-8 shadow-lg shadow-blue-500/20">
                   <i className="fa-solid fa-plus text-xl"></i>
                </div>
                <h4 className="text-3xl font-black mb-4 leading-tight">Create Smart Segment</h4>
                <p className="text-slate-400 text-sm">Define rules based on behavior, spend, or location to group your guests dynamically.</p>
             </div>
             <div className="flex items-center gap-3 text-blue-400 font-black text-xs uppercase tracking-[0.2em]">
                Start Wizard <i className="fa-solid fa-arrow-right group-hover:translate-x-3 transition-transform"></i>
             </div>
          </div>
          {segments.map(seg => (
            <div key={seg.id} className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all">
               <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                       {seg.memberCount} Members
                    </span>
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-2">{seg.name}</h4>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">{seg.description}</p>
               </div>
               <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Filters</p>
                  <p className="text-sm font-bold text-slate-700 truncate">{seg.criteria}</p>
               </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'ledger' && (
        <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
           <div className="p-10 border-b border-slate-100 flex justify-between items-center">
              <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">Global Communication Ledger</h4>
              <div className="flex gap-4">
                 <button className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase">Filter Channel</button>
                 <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase">Search Content</button>
              </div>
           </div>
           <div className="p-10 space-y-4">
              {commLogs.map(log => {
                const guest = customers.find(c => c.id === log.customerId);
                return (
                  <div key={log.id} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all group">
                    <div className="flex items-center gap-6">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                         log.type === 'Email' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                       }`}>
                         <i className={`fa-solid ${log.type === 'Email' ? 'fa-envelope' : 'fa-phone'}`}></i>
                       </div>
                       <div>
                          <div className="flex items-center gap-2">
                             <h5 className="font-bold text-slate-900">{log.subject}</h5>
                             <span className="text-[9px] font-black text-slate-400 uppercase">To: {guest?.firstName} {guest?.lastName}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 truncate max-w-md">{log.content}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{new Date(log.date).toLocaleDateString()}</p>
                       <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-lg">Delivered</span>
                    </div>
                  </div>
                );
              })}
           </div>
        </div>
      )}

      {selectedGuestId && renderGuestGenome(selectedGuestId)}
    </div>
  );
};

export default MarketingView;
