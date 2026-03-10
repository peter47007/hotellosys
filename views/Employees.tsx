
import React, { useState } from 'react';
import { Employee, Department, LeaveRecord, LeaveStatus, LeaveType, EmploymentStatus, UserRole } from '../types';

interface EmployeesViewProps {
  currentUserRole: UserRole;
  employees: Employee[];
  departments: Department[];
  leaveRecords: LeaveRecord[];
  leaveTypes: LeaveType[];
  onHire: (emp: Partial<Employee>) => void;
  onUpdateDepartment: (dept: Partial<Department>) => void;
  onDeleteDepartment: (id: string) => void;
  onApproveLeave: (leaveId: string, status: LeaveStatus) => void;
  onTransfer: (empId: string, newDeptId: string, reason: string) => void;
  onTerminate: (empId: string, reason: string) => void;
}

const EmployeesView: React.FC<EmployeesViewProps> = ({ 
  currentUserRole,
  employees, 
  departments, 
  leaveRecords, 
  leaveTypes,
  onHire,
  onUpdateDepartment,
  onDeleteDepartment,
  onApproveLeave,
  onTransfer,
  onTerminate
}) => {
  const [subTab, setSubTab] = useState<'directory' | 'departments' | 'leave'>('directory');
  const [showHireModal, setShowHireModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState<Partial<Department> | null>(null);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);

  const isOwnerOrAdmin = currentUserRole === 'HotelOwner' || currentUserRole === 'Admin';

  const getDepartmentName = (id: string) => departments.find(d => d.id === id)?.name || 'Unknown';
  const getLeaveTypeName = (id: string) => leaveTypes.find(t => t.id === id)?.name || 'General';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Human Capital Management</h3>
          <p className="text-slate-500 text-sm">Enterprise-grade lifecycle tracking and organizational management.</p>
        </div>
        <div className="flex gap-2">
          {isOwnerOrAdmin && (
            <button 
              onClick={() => setShowHireModal(true)}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10"
            >
              <i className="fa-solid fa-user-plus"></i>
              Hire Employee
            </button>
          )}
        </div>
      </div>

      <div className="flex border-b border-slate-200 gap-8">
        {[
          { id: 'directory', label: 'Directory', icon: 'fa-address-book' },
          { id: 'departments', label: 'Departments', icon: 'fa-sitemap' },
          { id: 'leave', label: 'Attendance & Leave', icon: 'fa-calendar-check' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)}
            className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 transition-all relative ${
              subTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <i className={`fa-solid ${tab.icon} text-xs`}></i>
            {tab.label}
            {subTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></div>}
          </button>
        ))}
      </div>

      {subTab === 'directory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {employees.filter(e => e.status !== EmploymentStatus.TERMINATED).map((emp) => (
            <div key={emp.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img src={emp.image} alt={emp.name} className="w-14 h-14 rounded-2xl object-cover ring-4 ring-slate-50" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg leading-tight">{emp.name}</h4>
                    <p className="text-blue-600 text-[11px] font-black uppercase tracking-widest">{emp.position}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full font-black uppercase text-[9px] ${
                  emp.status === EmploymentStatus.ACTIVE ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {emp.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Department</p>
                  <p className="text-sm font-bold text-slate-700">{getDepartmentName(emp.departmentId)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Annual Salary</p>
                  <p className="text-sm font-bold text-slate-900">${emp.salary.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Hired Date</p>
                  <p className="text-sm font-medium text-slate-500">{new Date(emp.hireDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Contact</p>
                  <p className="text-sm font-medium text-slate-500 truncate">{emp.email}</p>
                </div>
              </div>

              {isOwnerOrAdmin && (
                <div className="mt-6 pt-6 border-t border-slate-100 flex gap-2">
                  <button 
                    onClick={() => setSelectedEmp(emp)}
                    className="flex-1 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors"
                  >
                    Transfer
                  </button>
                  <button 
                    onClick={() => onTerminate(emp.id, 'Standard Exit')}
                    className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors"
                  >
                    Offboard
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {subTab === 'departments' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Active Departments</h4>
            {isOwnerOrAdmin && (
              <button 
                onClick={() => setShowDeptModal({ name: '', budget: 0, isActive: true })}
                className="text-blue-600 text-xs font-bold hover:underline"
              >
                + Create New Department
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {departments.map(dept => (
              <div key={dept.id} className="bg-white rounded-3xl border border-slate-200 p-6 flex items-start gap-6 hover:border-blue-200 transition-colors shadow-sm">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-xl">
                  <i className="fa-solid fa-building-user"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h5 className="font-bold text-slate-900 text-lg mb-1">{dept.name}</h5>
                    <div className="flex gap-2">
                      {isOwnerOrAdmin && (
                        <button 
                          onClick={() => setShowDeptModal(dept)}
                          className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <i className="fa-solid fa-pen text-xs"></i>
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">{dept.description || 'Core operational division'}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-xl">
                      <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Headcount</p>
                      <p className="font-bold text-slate-900">{employees.filter(e => e.departmentId === dept.id).length} Staff</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl">
                      <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Budget</p>
                      <p className="font-bold text-slate-900">${dept.budget.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 'leave' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Pending Absence Requests</h4>
            <div className="space-y-4">
              {leaveRecords.filter(r => r.status === LeaveStatus.PENDING).map(record => {
                const emp = employees.find(e => e.id === record.employeeId);
                return (
                  <div key={record.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6 animate-in slide-in-from-left-4 duration-300">
                    <img src={emp?.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-slate-900">{emp?.name}</h5>
                      <p className="text-xs text-slate-500">
                        Requesting <span className="font-bold text-slate-800">{getLeaveTypeName(record.leaveTypeId)}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                         <i className="fa-solid fa-calendar text-[10px] text-blue-500"></i>
                         <p className="text-[11px] font-bold text-slate-600">{new Date(record.startDate).toLocaleDateString()} - {new Date(record.endDate).toLocaleDateString()} ({record.days} Days)</p>
                      </div>
                    </div>
                    {isOwnerOrAdmin && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => onApproveLeave(record.id, LeaveStatus.REJECTED)}
                          className="w-10 h-10 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                        <button 
                          onClick={() => onApproveLeave(record.id, LeaveStatus.APPROVED)}
                          className="w-10 h-10 rounded-xl bg-green-500 text-white shadow-lg shadow-green-500/20 hover:bg-green-600 transition-colors"
                        >
                          <i className="fa-solid fa-check"></i>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              {leaveRecords.filter(r => r.status === LeaveStatus.PENDING).length === 0 && (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] p-16 text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4 shadow-sm">
                    <i className="fa-solid fa-check-double text-2xl"></i>
                  </div>
                  <h5 className="font-bold text-slate-900 mb-1">Queue Clear</h5>
                  <p className="text-slate-400 text-sm">No pending absence requests found in the system.</p>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Absence Utilization</h4>
            <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <i className="fa-solid fa-chart-pie text-7xl"></i>
               </div>
              <div className="relative z-10 space-y-6">
                {leaveTypes.map(type => {
                  const used = leaveRecords.filter(r => r.leaveTypeId === type.id && r.status === LeaveStatus.APPROVED).length * 15;
                  const percentage = Math.min((used / 100) * 100, 100);
                  return (
                    <div key={type.id}>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="font-bold opacity-60 tracking-wider uppercase">{type.name}</span>
                        <span className="font-mono text-blue-400">{used}%</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hire Modal */}
      {showHireModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-slate-900">New Onboarding</h3>
                <p className="text-slate-400 text-sm">Register a new employee into the system hierarchy.</p>
              </div>
              <button onClick={() => setShowHireModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <i className="fa-solid fa-times text-xl"></i>
              </button>
            </div>
            <div className="p-10 grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Full Legal Name</label>
                  <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10" placeholder="e.g. Michael Jordan" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Assigned Department</label>
                  <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Designated Position</label>
                  <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" placeholder="e.g. Concierge" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Annual Salary</label>
                  <input type="number" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" defaultValue={50000} />
                </div>
                <div className="col-span-2 mt-4">
                  <button 
                    onClick={() => setShowHireModal(false)}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
                  >
                    Confirm Employment Contract
                    <i className="fa-solid fa-signature text-xs"></i>
                  </button>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Dept Modal */}
      {showDeptModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900">{showDeptModal.id ? 'Edit Department' : 'New Department'}</h3>
              <button onClick={() => setShowDeptModal(null)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-times text-xl"></i>
              </button>
            </div>
            <div className="p-10 space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Department Name</label>
                  <input 
                    type="text" 
                    value={showDeptModal.name}
                    onChange={(e) => setShowDeptModal({...showDeptModal, name: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Allocated Budget ($)</label>
                  <input 
                    type="number" 
                    value={showDeptModal.budget}
                    onChange={(e) => setShowDeptModal({...showDeptModal, budget: Number(e.target.value)})}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Description</label>
                  <textarea 
                    value={showDeptModal.description}
                    onChange={(e) => setShowDeptModal({...showDeptModal, description: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none resize-none" 
                    rows={2}
                  />
                </div>
                <div className="flex gap-4 mt-6">
                  {showDeptModal.id && (
                    <button 
                      onClick={() => { onDeleteDepartment(showDeptModal.id!); setShowDeptModal(null); }}
                      className="px-6 py-4 border border-red-100 text-red-500 rounded-2xl font-bold hover:bg-red-50 transition-all"
                    >
                      Delete
                    </button>
                  )}
                  <button 
                    onClick={() => { onUpdateDepartment(showDeptModal); setShowDeptModal(null); }}
                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all"
                  >
                    Save Configuration
                  </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesView;
