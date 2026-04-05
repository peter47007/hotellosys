
import React, { useState } from 'react';
import { MenuItem } from '../types';

interface POSViewProps {
  type: 'Restaurant' | 'Bar';
  enabled: boolean;
}

const POSView: React.FC<POSViewProps> = ({ type, enabled }) => {
  const [cart, setCart] = useState<{item: MenuItem, quantity: number}[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');

  if (!enabled) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 text-3xl">
          <i className="fa-solid fa-lock"></i>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Module Disabled</h2>
        <p className="text-slate-500 max-w-sm">The {type} module is currently disabled in your subscription settings. Please enable it to use this feature.</p>
      </div>
    );
  }

  // Fix: Explicitly type the menu items array as MenuItem[] to ensure 'type' and 'module' properties 
  // are treated as their specific union types instead of general strings during filtering.
  const menuItems: MenuItem[] = ([
    { id: '1', name: 'Wagyu Burger', price: 28, category: 'Main', type: 'Food', module: 'Restaurant' },
    { id: '2', name: 'Caesar Salad', price: 18, category: 'Salad', type: 'Food', module: 'Restaurant' },
    { id: '3', name: 'Margarita Pizza', price: 22, category: 'Main', type: 'Food', module: 'Restaurant' },
    { id: '4', name: 'Old Fashioned', price: 16, category: 'Cocktails', type: 'Drink', module: 'Bar' },
    { id: '5', name: 'Craft Lager', price: 8, category: 'Beers', type: 'Drink', module: 'Bar' },
    { id: '6', name: 'Red Wine (Glass)', price: 14, category: 'Wines', type: 'Drink', module: 'Bar' },
  ] as MenuItem[]).filter(item => item.module === type);

  const categories = ['All', ...Array.from(new Set(menuItems.map(i => i.category)))];

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.item.id !== id));
  };

  const total = cart.reduce((acc, curr) => acc + (curr.item.price * curr.quantity), 0);

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)]">
      {/* Menu Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 custom-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2 custom-scrollbar">
          {menuItems.filter(i => activeCategory === 'All' || i.category === activeCategory).map(item => (
            <button
              key={item.id}
              onClick={() => addToCart(item)}
              className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-lg transition-all flex flex-col h-full group"
            >
              <div className="w-full h-32 bg-slate-100 rounded-xl mb-3 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-300">
                <i className={`fa-solid ${type === 'Restaurant' ? 'fa-bowl-food' : 'fa-wine-glass'} text-3xl opacity-30`}></i>
              </div>
              <h4 className="font-bold text-slate-800 line-clamp-2">{item.name}</h4>
              <p className="text-xs text-slate-500 font-medium mb-2">{item.category}</p>
              <p className="mt-auto text-blue-600 font-black text-lg">${item.price}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Cart/Bill Area */}
      <div className="w-full lg:w-96 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden sticky top-0">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <i className="fa-solid fa-receipt text-blue-500"></i>
            Current Bill
          </h3>
          <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-widest">Order #HOTS-0932</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 opacity-50">
              <i className="fa-solid fa-cart-shopping text-4xl"></i>
              <p className="text-sm font-medium">Cart is empty</p>
            </div>
          ) : (
            cart.map(line => (
              <div key={line.item.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl group">
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-bold text-slate-800 truncate">{line.item.name}</h5>
                  <p className="text-xs text-slate-500">x{line.quantity} &middot; ${line.item.price * line.quantity}</p>
                </div>
                <button 
                  onClick={() => removeFromCart(line.item.id)}
                  className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <i className="fa-solid fa-trash-can text-xs"></i>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>Tax (10%)</span>
              <span>${(total * 0.1).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Total</span>
              <span>${(total * 1.1).toFixed(2)}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors">
              Print Draft
            </button>
            <button className="py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSView;
