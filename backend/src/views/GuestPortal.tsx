
import React, { useState } from 'react';
import { Customer, Reservation, Invoice, LoyaltyTier, LoyaltyPointTransaction, GuestServiceRequest } from '../types';

interface GuestPortalProps {
  customer: Customer;
  reservation?: Reservation;
  invoices: Invoice[];
  tier: LoyaltyTier;
  onPostRequest: (req: Partial<GuestServiceRequest>) => void;
}

const GuestPortal: React.FC<GuestPortalProps> = ({ customer, reservation, invoices, tier, onPostRequest }) => {
  const [activeTab, setActiveTab] = useState<'stay' | 'services' | 'billing' | 'loyalty'>('stay');
  const [requestText, setRequestText] = useState('');

  const unpaidTotal = invoices.reduce((acc, inv) => acc + inv.balanceDue, 0);

  const renderServiceCard = (title: string, icon: string, color: string, type: GuestServiceRequest['type']) => (
    <button 
      onClick={() => {
        onPostRequest({ customerId: customer.id, type, description: `Standard ${type} requested via portal.`, timestamp: new Date(), status: 'Pending' });
        alert(`${title} request submitted to the front desk.`);
      }}
      className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-xl transition-all group"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg ${color} group-hover:scale-110 transition-transform`}>
        <i className={`fa-solid ${icon} text-xl`}></i>
      </div>
      <h5 className="font-black text-slate-900 text-sm mb-1">{title}</h5>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Instant Dispatch</p>
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Guest Header */}
      <div className="bg-slate-950 p-10 rounded-[48px] text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
            <i className="fa-solid fa-crown text-[8rem]"></i>
         </div>
         <div className="relative z-10 flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-[28px] flex items-center justify-center text-2xl font-black">
               {customer.firstName[0]}{customer.lastName[0]}
            </div>
            <div>
               <h3 className="text-3xl font-black">Hello, {customer.firstName}!</h3>
               <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest">{tier.name} Member</span>
                  <span className="text-blue-400 text-xs font-bold">{customer.loyaltyPoints.toLocaleString()} Points</span>
               </div>
            </div>
         </div>
      </div>

      {/* Navigation Chips */}
      <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
         {[
           { id: 'stay', label: 'My Stay', icon: 'fa-bed' },
           { id: 'services', label: 'Services', icon: 'fa-concierge-bell' },
           { id: 'billing', label: 'Billing', icon: 'fa-file-invoice-dollar' },
           { id: 'loyalty', label: 'Rewards', icon: 'fa-gift' }
         ].map(tab => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`flex-1 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex flex-col items-center gap-1 min-w-[80px] ${
               activeTab === tab.id ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'
             }`}
           >
             <i className={`fa-solid ${tab.icon} text-lg`}></i>
             {tab.label}
           </button>
         ))}
      </div>

      {activeTab === 'stay' && (
        <div className="space-y-6">
           {reservation ? (
             <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                <h4 className="font-black text-slate-900 text-lg mb-6 tracking-tight">Active Reservation</h4>
                <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Room Number</p>
                      <p className="text-xl font-black text-slate-900">302</p>
                   </div>
                   <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Stay Duration</p>
                      <p className="text-sm font-bold text-slate-700">Oct 10 - Oct 12</p>
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-slate-500">WIFI Password</span>
                      <span className="text-blue-600 font-black">HOTELLO2026</span>
                   </div>
                   <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-slate-500">Check-out Time</span>
                      <span className="text-slate-900 font-black">11:00 AM</span>
                   </div>
                </div>
             </div>
           ) : (
             <div className="bg-slate-50 p-20 rounded-[40px] border-2 border-dashed border-slate-200 text-center">
                <i className="fa-solid fa-hotel text-4xl text-slate-200 mb-4"></i>
                <h4 className="font-bold text-slate-400 uppercase tracking-widest">No Active Stay</h4>
                <button className="mt-6 px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">Book Now</button>
             </div>
           )}
        </div>
      )}

      {activeTab === 'services' && (
        <div className="space-y-6">
           <div className="grid grid-cols-2 gap-4">
              {renderServiceCard('Housekeeping', 'fa-broom', 'bg-blue-600', 'Housekeeping')}
              {renderServiceCard('Room Service', 'fa-utensils', 'bg-amber-600', 'RoomService')}
              {renderServiceCard('Maintenance', 'fa-wrench', 'bg-red-600', 'Maintenance')}
              {renderServiceCard('Concierge', 'fa-map-location-dot', 'bg-emerald-600', 'Concierge')}
           </div>
           <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Custom Request</h5>
              <textarea 
                value={requestText}
                onChange={(e) => setRequestText(e.target.value)}
                placeholder="How can we make your stay better?"
                className="w-full p-6 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/10 font-medium text-sm resize-none mb-4"
                rows={3}
              />
              <button className="w-full py-4 bg-slate-900 text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-lg shadow-slate-900/10">Submit Inquiry</button>
           </div>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="space-y-6">
           <div className="bg-slate-950 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Balance Due</p>
              <h4 className="text-5xl font-black mb-6">${unpaidTotal.toFixed(2)}</h4>
              <button className="w-full py-4 bg-blue-600 text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/30">Express Checkout</button>
           </div>
           <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <h5 className="font-black text-slate-900 text-xs uppercase tracking-widest">Recent Activity</h5>
              </div>
              <div className="divide-y divide-slate-100">
                 {invoices.map(inv => (
                   <div key={inv.id} className="p-6 flex justify-between items-center">
                      <div>
                         <p className="text-sm font-bold text-slate-800">{inv.invoiceNumber}</p>
                         <p className="text-[10px] text-slate-400 font-black uppercase">{inv.issueDate.toLocaleDateString()}</p>
                      </div>
                      <span className="font-black text-slate-900">${inv.totalAmount}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'loyalty' && (
        <div className="space-y-6">
           <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                 <i className="fa-solid fa-award text-slate-100 text-8xl"></i>
              </div>
              <div className="relative z-10">
                 <h4 className="font-black text-slate-900 text-xl mb-2">Next Tier Goal</h4>
                 <p className="text-slate-500 text-xs font-medium mb-8">You're just 450 points away from Silver status!</p>
                 <div className="h-4 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '65%' }}></div>
                 </div>
                 <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Bronze</span>
                    <span>Silver</span>
                 </div>
              </div>
           </div>
           <button className="w-full py-5 bg-slate-950 text-white rounded-[28px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3">
              <i className="fa-solid fa-gift"></i>
              Browse Rewards Store
           </button>
        </div>
      )}
    </div>
  );
};

export default GuestPortal;
