
import React, { useState } from 'react';
import { RestaurantTable, TableStatus, Order, OrderStatus, MenuItem, OrderItem } from '../types';

interface RestaurantViewProps {
  tables: RestaurantTable[];
  orders: Order[];
  menu: MenuItem[];
  onUpdateTable: (id: string, status: TableStatus) => void;
  onUpdateOrder: (id: string, status: OrderStatus) => void;
  onUpdateItemStatus: (orderId: string, itemId: string, status: OrderItem['status']) => void;
}

const RestaurantView: React.FC<RestaurantViewProps> = ({ 
  tables, 
  orders, 
  menu,
  onUpdateTable,
  onUpdateOrder,
  onUpdateItemStatus
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'tables' | 'kds' | 'menu'>('tables');

  const getTableStatusColor = (status: TableStatus) => {
    switch (status) {
      case TableStatus.AVAILABLE: return 'bg-emerald-500';
      case TableStatus.OCCUPIED: return 'bg-blue-600';
      case TableStatus.RESERVED: return 'bg-amber-500';
      default: return 'bg-slate-400';
    }
  };

  const activeKitchenOrders = orders.filter(o => 
    o.status === OrderStatus.PENDING || o.status === OrderStatus.IN_PROGRESS || o.status === OrderStatus.READY
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Restaurant Operations</h3>
          <p className="text-slate-500 text-sm">Table management, KDS, and culinary logistics.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          {[
            { id: 'tables', label: 'Table Map', icon: 'fa-border-all' },
            { id: 'kds', label: 'Kitchen (KDS)', icon: 'fa-fire-burner' },
            { id: 'menu', label: 'Menu Mgr', icon: 'fa-book-open' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                activeSubTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeSubTab === 'tables' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {tables.map(table => {
            const activeOrder = orders.find(o => o.tableId === table.id && o.status !== OrderStatus.COMPLETED);
            return (
              <div key={table.id} className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-2 h-full ${getTableStatusColor(table.status)}`}></div>
                <div className="flex flex-col h-full">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{table.location}</span>
                  <h4 className="text-3xl font-black text-slate-900 mb-1">{table.number}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-4">Cap: {table.capacity} Pax</p>
                  
                  <div className="mt-auto">
                    {activeOrder ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black text-blue-600 uppercase">Active Order</span>
                        <span className="text-xs font-bold">${activeOrder.total.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-1 rounded-lg ${
                        table.status === TableStatus.AVAILABLE ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {table.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeSubTab === 'kds' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeKitchenOrders.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
               <i className="fa-solid fa-utensils text-4xl text-slate-200 mb-4"></i>
               <h4 className="font-bold text-slate-400 uppercase tracking-widest text-sm">Kitchen Queue Clear</h4>
            </div>
          ) : (
            activeKitchenOrders.map(order => (
              <div key={order.id} className="bg-white rounded-[32px] border-2 border-slate-200 overflow-hidden shadow-lg animate-in zoom-in-95 duration-300">
                <div className={`p-5 flex justify-between items-center ${order.status === OrderStatus.READY ? 'bg-emerald-500' : 'bg-slate-900'} text-white`}>
                  <div>
                    <h5 className="font-black text-lg">Table {tables.find(t => t.id === order.tableId)?.number || 'N/A'}</h5>
                    <p className="text-[10px] font-bold uppercase opacity-60">#{order.orderNumber}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase bg-white/20 px-2 py-1 rounded-lg">
                      {order.items.length} Items
                    </span>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="space-y-2">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-100 group">
                        <div className="flex gap-3 items-center">
                          <span className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center font-black text-slate-900 text-xs">{item.quantity}</span>
                          <div>
                             <p className="font-bold text-sm text-slate-800">{item.name}</p>
                             {item.notes && <p className="text-[10px] text-red-500 font-bold italic">"{item.notes}"</p>}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {item.status === 'Pending' && (
                            <button 
                              onClick={() => onUpdateItemStatus(order.id, item.id, 'Cooking')}
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase hover:bg-blue-700 transition-colors"
                            >Cook</button>
                          )}
                          {item.status === 'Cooking' && (
                            <button 
                              onClick={() => onUpdateItemStatus(order.id, item.id, 'Ready')}
                              className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase hover:bg-emerald-600 transition-colors animate-pulse"
                            >Ready</button>
                          )}
                          {item.status === 'Ready' && <i className="fa-solid fa-circle-check text-emerald-500 text-sm"></i>}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Elapsed: 12m</span>
                    {order.items.every(i => i.status === 'Ready') && order.status !== OrderStatus.READY && (
                      <button 
                        onClick={() => onUpdateOrder(order.id, OrderStatus.READY)}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-emerald-600/20"
                      >Bump Order</button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeSubTab === 'menu' && (
        <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h4 className="font-black text-slate-900">Menu Master Management</h4>
              <p className="text-slate-400 text-xs font-bold">Configure offerings, availability, and prep times.</p>
            </div>
            <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
              <i className="fa-solid fa-plus"></i> Add Item
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Item</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Price</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Prep Time</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {menu.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                           <i className={`fa-solid ${item.type === 'Food' ? 'fa-bowl-food' : 'fa-wine-glass-empty'} text-xs`}></i>
                        </div>
                        <span className="font-bold text-slate-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <span className="text-[10px] font-black uppercase bg-slate-100 px-2 py-1 rounded-lg text-slate-500">{item.category}</span>
                    </td>
                    <td className="px-8 py-5">
                       <span className="font-black text-blue-600">${item.price.toFixed(2)}</span>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <span className="text-xs font-bold text-slate-600">{item.prepTime}m</span>
                    </td>
                    <td className="px-8 py-5">
                       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                         item.isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                       }`}>
                         {item.isAvailable ? 'Available' : 'Out of Stock'}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex justify-end gap-2">
                          <button className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"><i className="fa-solid fa-pen-to-square text-xs"></i></button>
                          <button className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors"><i className="fa-solid fa-trash-can text-xs"></i></button>
                       </div>
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

export default RestaurantView;
