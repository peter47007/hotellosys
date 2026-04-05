
import React, { useState } from 'react';
import { HousekeepingTask, HousekeepingStatus, Room, Employee } from '../types';

interface HousekeepingViewProps {
  tasks: HousekeepingTask[];
  rooms: Room[];
  employees: Employee[];
  onUpdateTaskStatus: (taskId: string, status: HousekeepingStatus) => void;
  onAssignStaff: (taskId: string, staffId: string) => void;
}

const HousekeepingView: React.FC<HousekeepingViewProps> = ({ 
  tasks, 
  rooms, 
  employees, 
  onUpdateTaskStatus,
  onAssignStaff 
}) => {
  const [filter, setFilter] = useState<HousekeepingStatus | 'All'>('All');

  const filteredTasks = filter === 'All' ? tasks : tasks.filter(t => t.status === filter);
  const getRoomNumber = (roomId: string) => rooms.find(r => r.id === roomId)?.number || 'N/A';
  const getStaffName = (staffId?: string) => employees.find(e => e.id === staffId)?.name || 'Unassigned';

  const getPriorityColor = (priority: HousekeepingTask['priority']) => {
    switch(priority) {
      case 'Urgent': return 'text-red-600 bg-red-50 border-red-100';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'Medium': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  const getStatusColor = (status: HousekeepingStatus) => {
    switch(status) {
      case HousekeepingStatus.INSPECTED: return 'bg-emerald-500 text-white';
      case HousekeepingStatus.COMPLETED: return 'bg-blue-500 text-white';
      case HousekeepingStatus.IN_PROGRESS: return 'bg-amber-500 text-white';
      default: return 'bg-slate-200 text-slate-600';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Housekeeping Command</h3>
          <p className="text-slate-500 text-sm">Automated sanitation cycles and unit inspection workflows.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          {['All', ...Object.values(HousekeepingStatus)].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                filter === status ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTasks.map(task => (
          <div key={task.id} className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl transition-all group">
            <div className="p-8 border-b border-slate-50 relative">
               <div className={`absolute top-0 right-0 p-8 opacity-10 rotate-12`}>
                  <i className={`fa-solid ${task.type === 'DeepClean' ? 'fa-broom-ball' : 'fa-spray-can-sparkles'} text-7xl`}></i>
               </div>
               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2.5 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest ${getPriorityColor(task.priority)}`}>
                      {task.priority} Priority
                    </span>
                    <span className="text-xs font-black text-slate-300">#{task.id.slice(-4).toUpperCase()}</span>
                  </div>
                  <h4 className="text-3xl font-black text-slate-900 leading-none mb-1">Room {getRoomNumber(task.roomId)}</h4>
                  <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em]">{task.type}</p>
               </div>
            </div>

            <div className="p-8 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                    <i className="fa-solid fa-user-circle text-lg"></i>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Assigned Agent</p>
                    <p className="text-sm font-bold text-slate-700">{getStaffName(task.assignedStaffId)}</p>
                  </div>
               </div>

               <div className="flex gap-2">
                 {task.status === HousekeepingStatus.PENDING && (
                   <button 
                    onClick={() => onUpdateTaskStatus(task.id, HousekeepingStatus.IN_PROGRESS)}
                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                   >Start Task</button>
                 )}
                 {task.status === HousekeepingStatus.IN_PROGRESS && (
                   <button 
                    onClick={() => onUpdateTaskStatus(task.id, HousekeepingStatus.COMPLETED)}
                    className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                   >Mark Clean</button>
                 )}
                 {task.status === HousekeepingStatus.COMPLETED && (
                   <button 
                    onClick={() => onUpdateTaskStatus(task.id, HousekeepingStatus.INSPECTED)}
                    className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                   >Approve Unit</button>
                 )}
                 {task.status === HousekeepingStatus.INSPECTED && (
                   <div className="flex-1 py-4 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                      <i className="fa-solid fa-circle-check"></i>
                      Unit Released
                   </div>
                 )}
               </div>
            </div>
            
            <div className={`px-8 py-3 text-center text-[9px] font-black uppercase tracking-widest ${getStatusColor(task.status)}`}>
               Status: {task.status}
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-100">
             <i className="fa-solid fa-check-double text-4xl text-slate-200 mb-4"></i>
             <h4 className="font-bold text-slate-400 uppercase tracking-widest">No Active Cleaning Requests</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default HousekeepingView;
