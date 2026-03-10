
import React, { useState } from 'react';
import { Room, RoomStatus, RoomType } from '../types';

interface RoomsViewProps {
  rooms: Room[];
  roomTypes: RoomType[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  onUpdateStatus: (roomId: string, newStatus: RoomStatus) => void;
}

const RoomsView: React.FC<RoomsViewProps> = ({ rooms, roomTypes, setRooms, onUpdateStatus }) => {
  const [filter, setFilter] = useState<RoomStatus | 'All'>('All');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const filteredRooms = filter === 'All' ? rooms : rooms.filter(r => r.status === filter);

  const getStatusStyle = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.AVAILABLE: return 'bg-green-100 text-green-700 border-green-200';
      case RoomStatus.OCCUPIED: return 'bg-blue-100 text-blue-700 border-blue-200';
      case RoomStatus.CLEANING: return 'bg-amber-100 text-amber-700 border-amber-200';
      case RoomStatus.MAINTENANCE: return 'bg-red-100 text-red-700 border-red-200';
      case RoomStatus.DIRTY: return 'bg-slate-200 text-slate-700 border-slate-300';
      case RoomStatus.RESERVED: return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getRoomType = (typeId: string) => roomTypes.find(t => t.id === typeId);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
            {['All', ...Object.values(RoomStatus)].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap ${
                  filter === status 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredRooms.map((room) => {
            const type = getRoomType(room.roomTypeId);
            return (
              <div 
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`group relative bg-white rounded-[32px] border p-6 cursor-pointer hover:shadow-xl transition-all duration-300 ${
                  selectedRoom?.id === room.id ? 'border-blue-500 ring-4 ring-blue-500/10 scale-[1.02]' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">F{room.floor}</span>
                    <i className={`fa-solid ${room.status === RoomStatus.OCCUPIED ? 'fa-user-check text-blue-500' : 'fa-door-open text-slate-200'} text-xs`}></i>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-1 leading-none">{room.number}</h3>
                  <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-4 truncate">{type?.name}</p>
                  
                  <div className="mt-auto">
                    <span className={`text-[9px] px-2.5 py-1.5 rounded-xl border font-black uppercase tracking-widest block text-center ${getStatusStyle(room.status)}`}>
                      {room.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedRoom && (
        <div className="w-full lg:w-96 bg-white rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden animate-in slide-in-from-right-8 duration-300 h-fit sticky top-8">
          <div className="p-10 bg-slate-950 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10">
               <i className="fa-solid fa-hotel text-8xl"></i>
            </div>
            <div className="relative z-10 flex justify-between items-start mb-6">
              <div>
                <h4 className="text-4xl font-black mb-1">Room {selectedRoom.number}</h4>
                <p className="text-blue-400 text-xs font-black uppercase tracking-[0.2em]">{getRoomType(selectedRoom.roomTypeId)?.name}</p>
              </div>
              <button onClick={() => setSelectedRoom(null)} className="text-slate-500 hover:text-white transition-colors">
                <i className="fa-solid fa-times text-2xl"></i>
              </button>
            </div>
            <div className="flex gap-4">
               <div className="bg-white/10 px-4 py-2 rounded-2xl">
                  <span className="block text-[8px] font-black uppercase text-blue-300 mb-1">Occupancy</span>
                  <span className="text-sm font-bold">Max {getRoomType(selectedRoom.roomTypeId)?.maxOccupancy}</span>
               </div>
               <div className="bg-white/10 px-4 py-2 rounded-2xl">
                  <span className="block text-[8px] font-black uppercase text-blue-300 mb-1">Base Rate</span>
                  <span className="text-sm font-bold">${selectedRoom.price}</span>
               </div>
            </div>
          </div>

          <div className="p-10 space-y-10">
            <div className="space-y-4">
              <h5 className="text-[10px] uppercase font-black text-slate-400 tracking-widest flex items-center gap-2">
                <i className="fa-solid fa-gears text-blue-500"></i> Operational Control
              </h5>
              <div className="grid grid-cols-1 gap-3">
                {selectedRoom.status === RoomStatus.AVAILABLE && (
                  <button 
                    onClick={() => onUpdateStatus(selectedRoom.id, RoomStatus.OCCUPIED)}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                  >
                    Immediate Check-In
                  </button>
                )}
                {selectedRoom.status === RoomStatus.OCCUPIED && (
                  <button 
                    onClick={() => onUpdateStatus(selectedRoom.id, RoomStatus.DIRTY)}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all"
                  >
                    Check-Out (Flag Dirty)
                  </button>
                )}
                {selectedRoom.status === RoomStatus.DIRTY && (
                  <button 
                    onClick={() => onUpdateStatus(selectedRoom.id, RoomStatus.CLEANING)}
                    className="w-full py-4 bg-amber-500 text-white rounded-2xl font-black text-sm hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
                  >
                    Assign Housekeeping
                  </button>
                )}
                {selectedRoom.status === RoomStatus.CLEANING && (
                  <button 
                    onClick={() => onUpdateStatus(selectedRoom.id, RoomStatus.AVAILABLE)}
                    className="w-full py-4 bg-green-500 text-white rounded-2xl font-black text-sm hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
                  >
                    Complete Cleaning
                  </button>
                )}
                
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button 
                    onClick={() => onUpdateStatus(selectedRoom.id, RoomStatus.MAINTENANCE)}
                    className="py-3 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors"
                  >
                    Maintenance
                  </button>
                  <button className="py-3 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">
                    History
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsView;
