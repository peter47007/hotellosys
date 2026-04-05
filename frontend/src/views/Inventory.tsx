
import React, { useState } from 'react';
import { InventoryItem, Supplier, PurchaseOrder, StockAudit, InventoryTransactionType, PurchaseOrderStatus } from '../types';

interface InventoryViewProps {
  items: InventoryItem[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  audits: StockAudit[];
  onUpdateStock: (itemId: string, qty: number, type: InventoryTransactionType) => void;
  onCreatePO: (po: Partial<PurchaseOrder>) => void;
}

const InventoryView: React.FC<InventoryViewProps> = ({ 
  items, 
  suppliers, 
  purchaseOrders, 
  audits,
  onUpdateStock,
  onCreatePO
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'items' | 'suppliers' | 'orders' | 'audits'>('items');

  const getStockStatus = (item: InventoryItem) => {
    if (item.stock <= 0) return { label: 'Out of Stock', color: 'bg-red-500', bg: 'bg-red-50 text-red-600' };
    if (item.stock <= item.minLevel) return { label: 'Low Stock', color: 'bg-amber-500', bg: 'bg-amber-50 text-amber-600' };
    return { label: 'Healthy', color: 'bg-emerald-500', bg: 'bg-emerald-50 text-emerald-600' };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Supply Chain & Inventory</h3>
          <p className="text-slate-500 text-sm">Enterprise stock tracking, procurement, and vendor relationships.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto custom-scrollbar">
          {[
            { id: 'items', label: 'Inventory Master', icon: 'fa-boxes-stacked' },
            { id: 'suppliers', label: 'Suppliers', icon: 'fa-truck-field' },
            { id: 'orders', label: 'Purchase Orders', icon: 'fa-file-invoice-dollar' },
            { id: 'audits', label: 'Stock Audits', icon: 'fa-clipboard-check' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${
                activeSubTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeSubTab === 'items' && (
        <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <div className="flex gap-4">
               <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-3">
                 <i className="fa-solid fa-magnifying-glass text-slate-300"></i>
                 <input type="text" placeholder="Search SKU or Item..." className="bg-transparent text-sm font-bold outline-none" />
               </div>
               <select className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold outline-none">
                 <option>All Categories</option>
                 <option>Food</option>
                 <option>Beverage</option>
                 <option>Housekeeping</option>
               </select>
             </div>
             <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/20">
               <i className="fa-solid fa-plus"></i> New Item
             </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">SKU / Item</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Stock Level</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Unit Cost</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map(item => {
                  const status = getStockStatus(item);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-black text-[10px]">
                            {item.sku.split('-')[1]}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900">{item.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{item.sku}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                         <span className="text-[10px] font-black uppercase text-slate-500">{item.category}</span>
                      </td>
                      <td className="px-8 py-5 text-center">
                         <div className="flex flex-col items-center">
                           <span className="font-black text-slate-900">{item.stock}</span>
                           <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{item.unit}</span>
                         </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="font-black text-slate-700">${item.unitCost.toFixed(2)}</span>
                      </td>
                      <td className="px-8 py-5">
                         <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${status.bg}`}>
                           {status.label}
                         </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                         <div className="flex justify-end gap-2">
                            <button className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"><i className="fa-solid fa-clock-rotate-left text-xs"></i></button>
                            <button className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-emerald-600 transition-colors"><i className="fa-solid fa-plus text-xs"></i></button>
                         </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map(sup => (
            <div key={sup.id} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-16 h-16 bg-slate-900 text-white rounded-[24px] flex items-center justify-center text-2xl shadow-lg">
                    <i className="fa-solid fa-building-circle-check"></i>
                 </div>
                 <div className="flex gap-1">
                   {[...Array(5)].map((_, i) => (
                     <i key={i} className={`fa-solid fa-star text-[10px] ${i < Math.floor(sup.rating) ? 'text-amber-400' : 'text-slate-200'}`}></i>
                   ))}
                 </div>
              </div>
              <h4 className="font-black text-xl text-slate-900 mb-1">{sup.name}</h4>
              <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-6">Primary Vendor</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-slate-500">
                  <i className="fa-solid fa-user-tie w-4 text-xs"></i>
                  <span className="text-sm font-bold">{sup.contact}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <i className="fa-solid fa-envelope w-4 text-xs"></i>
                  <span className="text-sm font-bold truncate">{sup.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <i className="fa-solid fa-phone w-4 text-xs"></i>
                  <span className="text-sm font-bold">{sup.phone}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">Catalog</button>
                <button className="flex-1 py-3.5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">Orders</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'orders' && (
        <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
           <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <h4 className="font-black text-slate-900">Purchase Order Registry</h4>
             <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
               <i className="fa-solid fa-cart-shopping"></i> Draft New PO
             </button>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-slate-50/50 border-b border-slate-100">
                   <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">PO #</th>
                   <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Supplier</th>
                   <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Items</th>
                   <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                   <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Total</th>
                   <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {purchaseOrders.map(po => (
                   <tr key={po.id} className="hover:bg-slate-50/30 transition-colors cursor-pointer group">
                     <td className="px-8 py-5">
                        <span className="font-mono text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{po.poNumber}</span>
                     </td>
                     <td className="px-8 py-5">
                        <span className="font-bold text-slate-800">{suppliers.find(s => s.id === po.supplierId)?.name}</span>
                     </td>
                     <td className="px-8 py-5 text-center">
                        <span className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600">{po.items.length}</span>
                     </td>
                     <td className="px-8 py-5">
                        <span className="text-xs font-bold text-slate-500">{new Date(po.orderDate).toLocaleDateString()}</span>
                     </td>
                     <td className="px-8 py-5">
                        <span className="font-black text-slate-900">${po.total.toFixed(2)}</span>
                     </td>
                     <td className="px-8 py-5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          po.status === PurchaseOrderStatus.RECEIVED ? 'bg-emerald-50 text-emerald-600' :
                          po.status === PurchaseOrderStatus.SUBMITTED ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {po.status}
                        </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {activeSubTab === 'audits' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-950 p-8 rounded-[40px] flex flex-col justify-between min-h-[300px] group cursor-pointer hover:scale-[1.02] transition-all">
             <div>
               <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/20">
                  <i className="fa-solid fa-clipboard-list"></i>
               </div>
               <h4 className="text-white font-black text-2xl mb-2">New Physical Count</h4>
               <p className="text-slate-500 text-sm">Initiate an enterprise-wide stock verification audit session.</p>
             </div>
             <div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-widest">
                Start Audit <i className="fa-solid fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
             </div>
          </div>
          {audits.map(audit => (
            <div key={audit.id} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12">
                 <i className="fa-solid fa-list-check text-8xl"></i>
              </div>
              <div>
                <div className="flex justify-between items-start mb-4">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(audit.auditDate).toLocaleDateString()}</span>
                   <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                     audit.status === 'Reconciled' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                   }`}>{audit.status}</span>
                </div>
                <h5 className="font-black text-lg text-slate-900 mb-1">Audit Session {audit.id.slice(-4).toUpperCase()}</h5>
                <p className="text-xs text-slate-500 font-bold mb-6">By {audit.conductedBy}</p>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-3xl flex justify-between items-center border border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase">Variance Total</span>
                <span className={`font-black ${audit.totalVariance < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {audit.totalVariance < 0 ? '-' : '+'}${Math.abs(audit.totalVariance).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InventoryView;
