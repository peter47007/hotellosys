
import React, { useState, useEffect } from 'react';
import { 
  RestaurantTable, TableStatus, Order, OrderStatus, MenuItem, OrderItem, 
  HotelProperty, User, StaffNotification, InventoryItem 
} from '../types';

interface StaffMobileHubProps {
  user: User;
  property: HotelProperty;
  tables: RestaurantTable[];
  orders: Order[];
  menu: MenuItem[];
  inventory: InventoryItem[];
  onAddOrder: (order: Partial<Order>) => void;
  onUpdateOrder: (id: string, status: OrderStatus) => void;
  onUpdateItemStatus: (orderId: string, itemId: string, status: OrderItem['status']) => void;
  onSettleOrder: (orderId: string, tableId: string) => void;
  onLogout: () => void;
}

const StaffMobileHub: React.FC<StaffMobileHubProps> = ({ 
  user, 
  property, 
  tables, 
  orders, 
  menu, 
  inventory,
  onAddOrder, 
  onUpdateOrder, 
  onUpdateItemStatus,
  onSettleOrder,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'tables' | 'menu' | 'kds' | 'notifications'>('tables');
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [currentOrder, setCurrentOrder] = useState<{item: MenuItem, qty: number}[]>([]);
  const [showSettlement, setShowSettlement] = useState<Order | null>(null);
  const [notifications, setNotifications] = useState<StaffNotification[]>([
    { id: 'n1', title: 'Table 10 Calling', message: 'Guest requested the bill.', type: 'TableCall', timestamp: new Date(), read: false },
  ]);

  // Set default tab based on role
  useEffect(() => {
    if (user.role === 'Chef') setActiveTab('kds');
  }, [user.role]);

  // Notify waiters when orders are READY
  useEffect(() => {
    const readyOrders = orders.filter(o => o.status === OrderStatus.READY && o.hotelId === property.id);
    if (readyOrders.length > 0 && user.role !== 'Chef') {
      const lastReady = readyOrders[readyOrders.length - 1];
      const exists = notifications.some(n => n.orderId === lastReady.id);
      if (!exists) {
        setNotifications(prev => [
          {
            id: `sn-${Date.now()}`,
            title: 'Pickup: Table ' + tables.find(t => t.id === lastReady.tableId)?.number,
            message: `Order #${lastReady.orderNumber} is ready to be served.`,
            type: 'OrderReady',
            timestamp: new Date(),
            read: false,
            orderId: lastReady.id
          },
          ...prev
        ]);
      }
    }
  }, [orders, user.role, property.id]);

  const filteredOrders = orders.filter(o => o.status !== OrderStatus.COMPLETED && o.hotelId === property.id);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleFireOrder = () => {
    if (!selectedTable) return;
    const newOrder: Partial<Order> = {
      orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      tableId: selectedTable.id,
      status: OrderStatus.PENDING,
      createdAt: new Date(),
      hotelId: property.id,
      total: currentOrder.reduce((acc, curr) => acc + (curr.item.price * curr.qty), 0),
      items: currentOrder.map(i => ({
        id: `oi-${Math.random()}`,
        menuItemId: i.item.id,
        name: i.item.name,
        quantity: i.qty,
        price: i.item.price,
        status: 'Pending'
      })) as any
    };
    onAddOrder(newOrder);
    setCurrentOrder([]);
    setSelectedTable(null);
    setActiveTab('tables');
  };

  const isLowStock = (itemName: string) => {
    const invItem = inventory.find(i => i.name.toLowerCase() === itemName.toLowerCase());
    return invItem ? invItem.stock <= invItem.minLevel : false;
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-inter select-none overflow-hidden">
      {/* Property Branding Header */}
      <header className={`shrink-0 pt-12 pb-6 px-6 rounded-b-[40px] shadow-2xl text-white relative overflow-hidden transition-all duration-700 ${property.color}`}>
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 scale-150">
           <i className={`fa-solid ${user.role === 'Chef' ? 'fa-kitchen-set' : 'fa-utensils'}`}></i>
        </div>
        <div className="relative z-10 flex justify-between items-end">
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">{property.name}</p>
              </div>
              <h2 className="text-2xl font-black tracking-tight">{activeTab === 'kds' ? 'Kitchen Feed' : activeTab === 'notifications' ? 'Staff Alerts' : 'Floor Map'}</h2>
           </div>
           <div className="text-right">
              <p className="text-[9px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full inline-block mb-1">{user.role}</p>
              <p className="text-sm font-black">{user.name}</p>
           </div>
        </div>
      </header>

      {/* Dynamic Content Area */}
      <main className="flex-1 overflow-y-auto p-4 custom-scrollbar pb-32">
        {activeTab === 'tables' && (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
            {tables.filter(t => t.hotelId === property.id).map(table => {
              const activeOrder = orders.find(o => o.tableId === table.id && o.status !== OrderStatus.COMPLETED);
              return (
                <div key={table.id} className="relative">
                  <button 
                    onClick={() => {
                      if (activeOrder) {
                        setShowSettlement(activeOrder);
                      } else {
                        setSelectedTable(table);
                        setActiveTab('menu');
                      }
                    }}
                    className={`w-full p-6 rounded-[32px] border-2 transition-all flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden active:scale-95 shadow-sm ${
                      table.status === TableStatus.OCCUPIED 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/30' 
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Table</span>
                    <span className="text-5xl font-black">{table.number}</span>
                    {activeOrder && (
                      <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-ping"></div>
                    )}
                    <p className="text-[9px] font-bold uppercase mt-2 opacity-60">
                      {activeOrder ? 'Settlement Ready' : `${table.capacity} Guests`}
                    </p>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between px-2">
               <button onClick={() => { setActiveTab('tables'); setCurrentOrder([]); }} className="text-slate-400 font-bold flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                  <i className="fa-solid fa-chevron-left"></i>
                  Back
               </button>
               <div className="text-right">
                  <span className="text-[10px] font-black text-slate-400 uppercase block leading-none">Ordering for</span>
                  <span className="text-lg font-black text-slate-900">Table {selectedTable?.number}</span>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
               {menu.filter(m => m.isAvailable).map(item => {
                 const lowStock = isLowStock(item.name);
                 return (
                  <button 
                      key={item.id}
                      onClick={() => {
                        const existing = currentOrder.find(i => i.item.id === item.id);
                        if (existing) setCurrentOrder(currentOrder.map(i => i.item.id === item.id ? {...i, qty: i.qty + 1} : i));
                        else setCurrentOrder([...currentOrder, { item, qty: 1 }]);
                      }}
                      className={`flex justify-between items-center p-5 bg-white border rounded-[28px] active:scale-[0.98] transition-all group shadow-sm ${
                        lowStock ? 'border-amber-200' : 'border-slate-200'
                      }`}
                  >
                      <div className="text-left flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                          lowStock ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'
                        }`}>
                            <i className={`fa-solid ${item.type === 'Food' ? 'fa-bowl-food' : 'fa-wine-glass'}`}></i>
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">{item.name}</p>
                            {lowStock && <p className="text-[9px] font-black text-amber-600 uppercase flex items-center gap-1"><i className="fa-solid fa-circle-exclamation text-[8px]"></i> Low Stock</p>}
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.category}</p>
                        </div>
                      </div>
                      <span className="font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-2xl">${item.price}</span>
                  </button>
                 );
               })}
            </div>
          </div>
        )}

        {activeTab === 'kds' && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
            {filteredOrders.length === 0 ? (
               <div className="py-20 text-center text-slate-300">
                  <i className="fa-solid fa-fire-burner text-6xl mb-4 opacity-20"></i>
                  <p className="font-black uppercase tracking-widest text-xs">Kitchen Clear (Node: {property.id})</p>
               </div>
            ) : (
              filteredOrders.map(order => (
                <div key={order.id} className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-lg border-l-[12px] border-l-blue-600">
                   <div className="p-5 flex justify-between items-center border-b border-slate-50 bg-slate-50/50">
                      <div>
                         <div className="flex items-center gap-2">
                           <h4 className="text-2xl font-black">Table {tables.find(t => t.id === order.tableId)?.number}</h4>
                           <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-lg text-[9px] font-black uppercase">Dine In</span>
                         </div>
                         <p className="text-[10px] font-black text-slate-400 uppercase mt-0.5">#{order.orderNumber} • Fire Node: {user.hotelId}</p>
                      </div>
                      {order.status === OrderStatus.READY ? (
                        <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase">
                           <i className="fa-solid fa-check-double animate-bounce"></i>
                           Ready
                        </div>
                      ) : (
                        <button 
                          onClick={() => onUpdateOrder(order.id, OrderStatus.READY)}
                          className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95"
                        >Bump All</button>
                      )}
                   </div>
                   <div className="p-6 space-y-4">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                           <div className="flex gap-4 items-center">
                              <span className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center font-black text-slate-900 text-sm">{item.quantity}</span>
                              <span className={`font-bold text-sm ${item.status === 'Ready' ? 'line-through text-slate-300' : 'text-slate-800'}`}>{item.name}</span>
                           </div>
                           <button 
                             onClick={() => onUpdateItemStatus(order.id, item.id, item.status === 'Pending' ? 'Cooking' : 'Ready')}
                             className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                               item.status === 'Ready' ? 'bg-emerald-500 text-white' : 
                               item.status === 'Cooking' ? 'bg-amber-400 text-white animate-pulse' : 'bg-white text-slate-300 border border-slate-100'
                             }`}
                           >
                             <i className={`fa-solid ${item.status === 'Ready' ? 'fa-check' : 'fa-fire'}`}></i>
                           </button>
                        </div>
                      ))}
                   </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            {notifications.length === 0 ? (
              <div className="py-20 text-center text-slate-300">
                <i className="fa-solid fa-bell-slash text-6xl mb-4 opacity-20"></i>
                <p className="font-black uppercase tracking-widest text-xs">No Recent Alerts</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div 
                  key={notif.id} 
                  onClick={() => setNotifications(prev => prev.map(n => n.id === notif.id ? {...n, read: true} : n))}
                  className={`p-6 rounded-[32px] border transition-all flex gap-5 relative group cursor-pointer ${
                    notif.read ? 'bg-white border-slate-100' : 'bg-white border-blue-200 ring-2 ring-blue-500/10'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    notif.type === 'OrderReady' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'
                  }`}>
                    <i className={`fa-solid ${notif.type === 'OrderReady' ? 'fa-plate-wheat' : 'fa-hand-pointer'} text-xl`}></i>
                  </div>
                  <div className="flex-1">
                    {!notif.read && <div className="absolute top-6 right-6 w-3 h-3 bg-blue-500 rounded-full"></div>}
                    <h5 className="font-black text-slate-900 leading-tight">{notif.title}</h5>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">{notif.message}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-3">{new Date(notif.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Settlement Drawer (Waiter Terminal Mode) */}
      {showSettlement && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-slate-900 w-full max-w-lg rounded-t-[50px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
              <div className="p-10 text-white">
                 <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-3xl font-black">Settlement</h3>
                      <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Table {tables.find(t => t.id === showSettlement.tableId)?.number} • Bill Total</p>
                    </div>
                    <button onClick={() => setShowSettlement(null)} className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                       <i className="fa-solid fa-times"></i>
                    </button>
                 </div>

                 <div className="space-y-4 mb-10">
                    <div className="flex justify-between text-sm opacity-60">
                       <span>Subtotal</span>
                       <span>${showSettlement.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm opacity-60">
                       <span>Service (10%)</span>
                       <span>${(showSettlement.total * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                       <span className="font-black uppercase text-xs tracking-widest">Grand Total</span>
                       <span className="text-4xl font-black text-blue-400">${(showSettlement.total * 1.1).toFixed(2)}</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={() => {
                        onSettleOrder(showSettlement.id, showSettlement.tableId!);
                        setShowSettlement(null);
                        setActiveTab('tables');
                      }}
                      className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3"
                    >
                       <i className="fa-solid fa-credit-card"></i>
                       Confirm Payment
                    </button>
                    <button className="w-full py-4 bg-white/5 text-white/40 rounded-2xl font-black text-[10px] uppercase tracking-widest">Print Receipt</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Floating Action Drawer for Waiters (Order Basket) */}
      {currentOrder.length > 0 && activeTab === 'menu' && (
        <div className="fixed bottom-24 left-4 right-4 bg-slate-950 text-white p-6 rounded-[40px] shadow-2xl animate-in slide-in-from-bottom-8 duration-300 z-50">
           <div className="flex justify-between items-center mb-6">
              <div>
                 <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Bucket: {currentOrder.reduce((acc, c) => acc + c.qty, 0)} Items</p>
                 <h4 className="text-3xl font-black">${currentOrder.reduce((acc, curr) => acc + (curr.item.price * curr.qty), 0)}</h4>
              </div>
              <button 
                onClick={handleFireOrder}
                className="px-10 py-5 bg-blue-600 text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/30 active:scale-95"
              >
                Fire Kitchen
              </button>
           </div>
           <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
              {currentOrder.map(i => (
                <div key={i.item.id} className="px-5 py-3 bg-white/10 rounded-2xl text-[10px] font-bold whitespace-nowrap flex items-center gap-3">
                   <span className="text-blue-400">{i.qty}x</span>
                   <span>{i.item.name}</span>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Mobile Tab Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-8 py-4 flex justify-around items-center safe-area-bottom z-[60] shadow-[0_-20px_25px_-5px_rgb(0,0,0,0.05)]">
        <button 
          onClick={() => setActiveTab('tables')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'tables' || activeTab === 'menu' ? 'text-blue-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <i className="fa-solid fa-map-location-dot text-xl"></i>
          <span className="text-[9px] font-black uppercase tracking-widest">Floor</span>
        </button>
        <button 
          onClick={() => setActiveTab('kds')}
          className={`flex flex-col items-center gap-1 transition-all relative ${activeTab === 'kds' ? 'text-blue-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <i className="fa-solid fa-fire-burner text-xl"></i>
          <span className="text-[9px] font-black uppercase tracking-widest">Kitchen</span>
          {filteredOrders.length > 0 && <span className="absolute -top-1 -right-2 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center border-2 border-white font-black">{filteredOrders.length}</span>}
        </button>
        <button 
          onClick={() => setActiveTab('notifications')}
          className={`flex flex-col items-center gap-1 transition-all relative ${activeTab === 'notifications' ? 'text-blue-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <i className="fa-solid fa-bell text-xl"></i>
          <span className="text-[9px] font-black uppercase tracking-widest">Alerts</span>
          {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full border-2 border-white"></span>}
        </button>
        <button 
          onClick={onLogout}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-red-500 transition-colors"
        >
          <i className="fa-solid fa-power-off text-xl"></i>
          <span className="text-[9px] font-black uppercase tracking-widest">Exit</span>
        </button>
      </nav>
    </div>
  );
};

export default StaffMobileHub;
