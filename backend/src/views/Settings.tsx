
import React, { useState } from 'react';
import { AppConfig, License, User } from '../types';

interface SettingsProps {
  config: AppConfig;
  license: License | null;
  user: User | null;
  onUpdateConfig: (newConfig: Partial<AppConfig>) => void;
  fees: { base: number, module: number };
  setFees: (fees: { base: number, module: number }) => void;
}

const Settings: React.FC<SettingsProps> = ({ config, license, user, onUpdateConfig, fees, setFees }) => {
  const [providerTab, setProviderTab] = useState<'general' | 'provider'>('general');
  const [generatedKey, setGeneratedKey] = useState('');

  const isRoot = user?.username === 'buyza_root';

  const generateKey = () => {
    const segment = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    const key = `HOTELLO-${segment()}-${segment()}-${segment()}-HOTELLO`;
    setGeneratedKey(key);
  };

  if (user?.role !== 'Admin' && !isRoot) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center">
        <i className="fa-solid fa-shield-halved text-5xl text-slate-200 mb-4"></i>
        <h2 className="text-xl font-bold text-slate-800">Access Restricted</h2>
        <p className="text-slate-500 max-w-xs mt-2">Only administrators can modify system-wide configurations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      {isRoot && (
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm w-fit mb-4">
           <button onClick={() => setProviderTab('general')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${providerTab === 'general' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>General Settings</button>
           <button onClick={() => setProviderTab('provider')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${providerTab === 'provider' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Provider Console</button>
        </div>
      )}

      {providerTab === 'general' ? (
        <>
          <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <h3 className="text-lg font-black text-slate-900">Hotel Properties</h3>
              <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">
                Save Global Config
              </button>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Hotel Identity</label>
                  <input 
                    type="text" 
                    value={config.hotelName}
                    onChange={(e) => onUpdateConfig({ hotelName: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">HQ Physical Address</label>
                  <textarea 
                    rows={3}
                    value={config.address}
                    onChange={(e) => onUpdateConfig({ address: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold resize-none"
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Base Currency</label>
                    <select 
                      value={config.currency}
                      onChange={(e) => onUpdateConfig({ currency: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Tax Rate (%)</label>
                    <input 
                      type="number" 
                      value={config.taxRate}
                      onChange={(e) => onUpdateConfig({ taxRate: Number(e.target.value) })}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/30">
              <h3 className="text-lg font-black text-slate-900">License & Modular Security</h3>
            </div>
            <div className="p-8">
              <div className="bg-slate-950 rounded-[32px] p-10 text-white mb-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
                   <i className="fa-solid fa-key text-[10rem]"></i>
                </div>
                <div className="relative z-10 flex justify-between items-start mb-10">
                  <div>
                    <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] mb-2">Authenticated License</p>
                    <h4 className="text-4xl font-mono tracking-tight font-black">{license?.key}</h4>
                  </div>
                  <span className="px-4 py-1.5 bg-emerald-500 text-[10px] font-black uppercase rounded-xl shadow-lg shadow-emerald-500/20">Active Node</span>
                </div>
                <div className="grid grid-cols-3 gap-8 border-t border-white/10 pt-8 relative z-10">
                  <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-2">Current Status</p>
                    <p className="text-lg font-black text-slate-200">{license?.status}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-2">Expiry Date</p>
                    <p className="text-lg font-black text-slate-200">{license?.expiresAt}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-2">Service Plan</p>
                    <p className="text-lg font-black text-blue-400">Enterprise Fleet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
           <div className="bg-slate-950 p-12 rounded-[56px] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                 <i className="fa-solid fa-screwdriver-wrench text-[12rem]"></i>
              </div>
              <div className="relative z-10">
                 <h3 className="text-4xl font-black mb-2 tracking-tight">Provider Operations</h3>
                 <p className="text-blue-400 text-xs font-black uppercase tracking-[0.3em] mb-12">Buyza Intelligence Distribution Hub</p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <section className="space-y-6">
                       <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Key Generation</h4>
                       <div className="bg-white/5 p-8 rounded-[40px] border border-white/10">
                          <button 
                            onClick={generateKey}
                            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/30 mb-6 hover:bg-blue-700 transition-all"
                          >Generate New License Key</button>
                          
                          {generatedKey && (
                            <div className="space-y-4 animate-in fade-in zoom-in-95">
                               <p className="text-[10px] font-black text-blue-400 uppercase text-center">Copy & Sell This Key</p>
                               <div className="bg-slate-900 p-6 rounded-2xl border border-blue-500/30 text-center select-all">
                                  <code className="text-2xl font-mono font-black tracking-widest text-white">{generatedKey}</code>
                               </div>
                            </div>
                          )}
                       </div>
                    </section>

                    <section className="space-y-6">
                       <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pricing & Revenue Model</h4>
                       <div className="space-y-4">
                          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex justify-between items-center">
                             <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase">Base Monthly Subscription</p>
                                <p className="text-2xl font-black text-white">${fees.base}</p>
                             </div>
                             <button onClick={() => setFees({...fees, base: fees.base + 10})} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center">
                                <i className="fa-solid fa-plus"></i>
                             </button>
                          </div>
                          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex justify-between items-center">
                             <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase">Module Surcharge (per unit)</p>
                                <p className="text-2xl font-black text-white">${fees.module}</p>
                             </div>
                             <button onClick={() => setFees({...fees, module: fees.module + 5})} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center">
                                <i className="fa-solid fa-plus"></i>
                             </button>
                          </div>
                       </div>
                    </section>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
