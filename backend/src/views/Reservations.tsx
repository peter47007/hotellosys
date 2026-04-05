
import React, { useState, useEffect, useMemo } from 'react';
import { Reservation, ReservationStatus, ReservationType, Room, RoomType, Customer, RoomStatus } from '../types';

interface ReservationsViewProps {
  reservations: Reservation[];
  rooms: Room[];
  roomTypes: RoomType[];
  customers: Customer[];
  onAddReservation: (res: Partial<Reservation>) => void;
  onUpdateStatus: (id: string, status: ReservationStatus) => void;
}

const ReservationsView: React.FC<ReservationsViewProps> = ({ 
  reservations, 
  rooms, 
  roomTypes, 
  customers,
  onAddReservation,
  onUpdateStatus
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'timeline' | 'mobile'>('timeline');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [now, setNow] = useState(new Date());
  const [bookingStep, setBookingStep] = useState(1);
  const [newBooking, setNewBooking] = useState<Partial<Reservation>>({
    checkInDate: new Date(),
    checkOutDate: new Date(Date.now() + 86400000),
    numberOfGuests: 1
  });

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getCustomerName = (id: string) => {
    const c = customers.find(cust => cust.id === id);
    return c ? `${c.firstName} ${c.lastName}` : 'Walk-in Guest';
  };

  const getRoomNumber = (id: string) => rooms.find(r => r.id === id)?.number || 'N/A';

  // Timeline Logic
  const timelineDates = useMemo(() => {
    const dates = [];
    const start = new Date();
    start.setHours(0,0,0,0);
    for (let i = 0; i < 14; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, []);

  const isRoomBookedOnDate = (roomId: string, date: Date) => {
    return reservations.find(res => {
      if (res.roomId !== roomId || res.status === ReservationStatus.CANCELLED) return false;
      const start = new Date(res.checkInDate);
      start.setHours(0,0,0,0);
      const end = new Date(res.checkOutDate);
      end.setHours(0,0,0,0);
      const target = new Date(date);
      target.setHours(0,0,0,0);
      return target >= start && target < end;
    });
  };

  const handleCreateBooking = () => {
    onAddReservation(newBooking);
    setShowBookingModal(false);
    setBookingStep(1);
    setNewBooking({
      checkInDate: new Date(),
      checkOutDate: new Date(Date.now() + 86400000),
      numberOfGuests: 1
    });
  };

  const formatTimeRemaining = (expiry?: Date) => {
    if (!expiry) return null;
    const diff = expiry.getTime() - now.getTime();
    if (diff <= 0) return <span className="text-red-500 font-black">EXPIRED</span>;
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return <div className="font-mono text-blue-600 font-black text-xs">{hours}h {mins}m {secs}s</div>;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Reservations & Booking</h3>
          <p className="text-slate-500 text-sm">Real-time availability and guest lifecycle tracking.</p>
        </div>
        <button 
          onClick={() => setShowBookingModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xl shadow-blue-600/20"
        >
          <i className="fa-solid fa-calendar-plus"></i>
          New Reservation
        </button>
      </div>

      <div className="flex border-b border-slate-200 gap-8">
        {[
          { id: 'timeline', label: 'Timeline View', icon: 'fa-timeline' },
          { id: 'list', label: 'All Bookings', icon: 'fa-list-check' },
          { id: 'mobile', label: 'Mobile Sync', icon: 'fa-mobile-screen-button' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 transition-all relative ${
              activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <i className={`fa-solid ${tab.icon} text-xs`}></i>
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></div>}
          </button>
        ))}
      </div>

      {activeTab === 'timeline' && (
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-slate-50">
                  <th className="sticky left-0 z-20 bg-slate-50 px-6 py-4 border-r border-slate-200 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest min-w-[150px]">Room</th>
                  {timelineDates.map((date, idx) => (
                    <th key={idx} className={`px-2 py-4 border-r border-slate-100 text-center min-w-[80px] ${date.getDay() === 0 || date.getDay() === 6 ? 'bg-blue-50/30' : ''}`}>
                      <div className="text-[10px] font-black text-slate-400 uppercase mb-1">{date.toLocaleDateString(undefined, { weekday: 'short' })}</div>
                      <div className={`text-sm font-black ${date.toDateString() === new Date().toDateString() ? 'text-blue-600' : 'text-slate-800'}`}>{date.getDate()}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rooms.map(room => (
                  <tr key={room.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="sticky left-0 z-10 bg-white px-6 py-4 border-r border-slate-200 group">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 leading-none mb-1 group-hover:text-blue-600 transition-colors">Room {room.number}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{roomTypes.find(t => t.id === room.roomTypeId)?.name}</span>
                      </div>
                    </td>
                    {timelineDates.map((date, idx) => {
                      const res = isRoomBookedOnDate(room.id, date);
                      return (
                        <td key={idx} className={`border-r border-slate-100 p-1 relative min-h-[60px] ${date.getDay() === 0 || date.getDay() === 6 ? 'bg-blue-50/10' : ''}`}>
                          {res && (
                            <div className={`h-full w-full rounded-lg flex items-center justify-center p-2 text-[8px] font-black uppercase tracking-tight overflow-hidden transition-all hover:scale-[1.05] hover:z-10 shadow-sm ${
                              res.status === ReservationStatus.CHECKED_IN ? 'bg-green-500 text-white' : 
                              res.status === ReservationStatus.CONFIRMED ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                            }`}>
                              <span className="truncate">{getCustomerName(res.customerId)}</span>
                            </div>
                          )}
                          {!res && (
                             <div className="h-full w-full min-h-[40px] flex items-center justify-center group/cell">
                               <button 
                                onClick={() => {
                                  setNewBooking({ ...newBooking, roomId: room.id, checkInDate: date });
                                  setShowBookingModal(true);
                                }}
                                className="w-full h-full opacity-0 group-hover/cell:opacity-100 transition-opacity bg-slate-50 text-blue-500 rounded-lg">
                                 <i className="fa-solid fa-plus text-[10px]"></i>
                               </button>
                             </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'list' && (
        <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Res #</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Guest</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Dates</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reservations.map(res => (
                  <tr key={res.id} className="hover:bg-slate-50/30 transition-colors group cursor-pointer">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-mono text-sm font-bold text-slate-900">{res.reservationNumber}</span>
                        <span className="text-[9px] text-blue-500 font-black uppercase">{res.type}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold">
                          {getCustomerName(res.customerId).charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{getCustomerName(res.customerId)}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Room {getRoomNumber(res.roomId)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-bold text-slate-700">
                        {new Date(res.checkInDate).toLocaleDateString()} - {new Date(res.checkOutDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        res.status === ReservationStatus.CHECKED_IN ? 'bg-green-100 text-green-700' :
                        res.status === ReservationStatus.CONFIRMED ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right font-black text-slate-900">${res.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'mobile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.filter(r => r.type === ReservationType.BUYZA_MOBILE && r.status === ReservationStatus.PENDING).map(res => (
            <div key={res.id} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-lg relative overflow-hidden group">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-50 rounded-full group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
                 <i className="fa-solid fa-mobile-screen-button text-blue-200 text-4xl"></i>
              </div>
              <div className="relative z-10">
                <h4 className="font-black text-xl text-slate-900 mb-1">{getCustomerName(res.customerId)}</h4>
                <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] mb-6">BUYZA Mobile Hold</p>
                
                <div className="bg-slate-50 p-4 rounded-3xl mb-6 flex justify-between items-center border border-slate-100">
                  <div className="text-[10px] font-black text-slate-400 uppercase">Expires In</div>
                  {formatTimeRemaining(res.holdExpiresAt)}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Room</p>
                    <p className="font-black text-slate-900">{getRoomNumber(res.roomId)}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Downpay</p>
                    <p className="font-black text-green-600">${res.depositPaid}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Finalize Stay</button>
                  <button className="w-14 h-14 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all">
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showBookingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/50 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-12 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div>
                 <div className="flex items-center gap-2 mb-1">
                   {[1, 2, 3].map(s => (
                     <div key={s} className={`h-1.5 w-8 rounded-full transition-all duration-300 ${bookingStep >= s ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                   ))}
                 </div>
                 <h3 className="text-3xl font-black text-slate-900">
                    {bookingStep === 1 ? 'Date & Room' : bookingStep === 2 ? 'Guest Profile' : 'Booking Summary'}
                 </h3>
               </div>
               <button onClick={() => { setShowBookingModal(false); setBookingStep(1); }} className="w-12 h-12 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors">
                 <i className="fa-solid fa-times text-xl"></i>
               </button>
             </div>

             <div className="p-12">
                {bookingStep === 1 && (
                  <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Check-In</label>
                        <input 
                          type="date" 
                          value={new Date(newBooking.checkInDate!).toISOString().split('T')[0]}
                          onChange={(e) => setNewBooking({...newBooking, checkInDate: new Date(e.target.value)})}
                          className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Check-Out</label>
                        <input 
                          type="date" 
                          value={new Date(newBooking.checkOutDate!).toISOString().split('T')[0]}
                          onChange={(e) => setNewBooking({...newBooking, checkOutDate: new Date(e.target.value)})}
                          className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Available Room</label>
                      <select 
                        value={newBooking.roomId}
                        onChange={(e) => setNewBooking({...newBooking, roomId: e.target.value})}
                        className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                      >
                        <option value="">Select a Room...</option>
                        {rooms.map(r => (
                          <option key={r.id} value={r.id}>Room {r.number} - {roomTypes.find(t => t.id === r.roomTypeId)?.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {bookingStep === 2 && (
                  <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Guest Primary Account</label>
                      <select 
                        value={newBooking.customerId}
                        onChange={(e) => setNewBooking({...newBooking, customerId: e.target.value})}
                        className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold"
                      >
                        <option value="">Select Guest...</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Internal Notes</label>
                      <textarea 
                        value={newBooking.notes}
                        onChange={(e) => setNewBooking({...newBooking, notes: e.target.value})}
                        className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold resize-none" 
                        rows={3} 
                        placeholder="Special requests or arrival info..."
                      />
                    </div>
                  </div>
                )}

                {bookingStep === 3 && (
                  <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                    <div className="bg-slate-900 rounded-3xl p-8 text-white">
                       <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-6">
                          <div>
                            <p className="text-[10px] font-black text-blue-400 uppercase mb-1">Guest Name</p>
                            <h4 className="text-xl font-bold">{getCustomerName(newBooking.customerId!)}</h4>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-blue-400 uppercase mb-1">Room</p>
                             <h4 className="text-xl font-bold">{getRoomNumber(newBooking.roomId!)}</h4>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-8">
                          <div>
                             <p className="text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">Duration</p>
                             <p className="text-sm font-bold">
                               {new Date(newBooking.checkInDate!).toLocaleDateString()} &rarr; {new Date(newBooking.checkOutDate!).toLocaleDateString()}
                             </p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">Est. Total</p>
                             <p className="text-2xl font-black text-blue-400">$340.00</p>
                          </div>
                       </div>
                    </div>
                  </div>
                )}

                <div className="mt-12 flex justify-between items-center">
                  {bookingStep > 1 && (
                    <button onClick={() => setBookingStep(bookingStep - 1)} className="text-sm font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest px-6">Previous</button>
                  )}
                  <div className="flex-1"></div>
                  <button 
                    onClick={() => bookingStep === 3 ? handleCreateBooking() : setBookingStep(bookingStep + 1)}
                    className="px-12 py-5 bg-blue-600 text-white rounded-3xl font-black shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98] transition-all"
                  >
                    {bookingStep === 3 ? 'Confirm & Deploy' : 'Continue Workflow'}
                  </button>
                </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ReservationsView;
