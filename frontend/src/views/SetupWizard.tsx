
import React, { useState } from 'react';
import { AppConfig, License, LicenseStatus } from '../types';

interface SetupWizardProps {
  onComplete: (config: AppConfig, license: License) => void;
}

const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    hotelName: '',
    address: '',
    taxRate: 10,
    licenseKey: '',
    adminUser: 'admin',
    adminPass: ''
  });
  const [error, setError] = useState('');

  const validateLicense = (key: string) => {
    const regex = /^HOTELLO-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-HOTELLO$/;
    return regex.test(key);
  };

  const handleNext = () => {
    if (step === 1 && (!formData.hotelName.trim() || !formData.address.trim())) {
      setError('Hotel name and address are required');
      return;
    }
    if (step === 2 && !validateLicense(formData.licenseKey)) {
      setError('Invalid license format. Required: HOTELLO-XXXX-XXXX-XXXX-HOTELLO');
      return;
    }
    if (step === 3 && formData.adminPass.length < 6) {
      setError('Master password must be at least 6 characters');
      return;
    }
    
    setError('');
    if (step < 3) setStep(step + 1);
    else {
      onComplete(
        { 
          hotelName: formData.hotelName, 
          address: formData.address,
          taxRate: formData.taxRate,
          currency: 'USD', 
          setupComplete: true 
        },
        { 
          key: formData.licenseKey, 
          status: LicenseStatus.VALID, 
          modules: { rooms: true, restaurant: true, bar: true },
          expiresAt: '2027-12-31'
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-inter">
      <div className="w-full max-w-3xl bg-white rounded-[32px] shadow-2xl border border-white/10 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col md:flex-row min-h-[550px]">
          {/* Progress Sidebar */}
          <div className="md:w-72 bg-slate-900 p-10 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                  <i className="fa-solid fa-hotel"></i>
                </div>
                <h2 className="text-xl font-black tracking-tight">HotelloSys</h2>
              </div>
              
              <div className="space-y-10 relative">
                <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-800 z-0"></div>
                {[
                  { n: 1, label: 'Identity', desc: 'Hotel details & location' },
                  { n: 2, label: 'Licensing', desc: 'Modular activation' },
                  { n: 3, label: 'Security', desc: 'Master credentials' }
                ].map((s) => (
                  <div key={s.n} className={`flex items-start gap-4 transition-all duration-500 relative z-10 ${step === s.n ? 'opacity-100 scale-105' : 'opacity-40'}`}>
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs border-2 ${step === s.n ? 'bg-blue-600 border-blue-400' : 'bg-slate-900 border-slate-700'}`}>
                      {s.n}
                    </div>
                    <div>
                      <p className="text-sm font-bold leading-tight">{s.label}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-8 border-t border-slate-800">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Phase 1 Deployment</p>
              <p className="text-xs text-slate-400">Foundation v1.0.4</p>
            </div>
          </div>

          {/* Form Area */}
          <div className="flex-1 p-10 md:p-14 bg-slate-50/50">
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-3xl font-black text-slate-900 mb-2">Establishment Identity</h3>
                <p className="text-slate-500 text-sm mb-10">Define the core profile for your local database initialization.</p>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Official Hotel Name</label>
                    <input 
                      type="text" 
                      value={formData.hotelName}
                      onChange={(e) => setFormData({...formData, hotelName: e.target.value})}
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                      placeholder="e.g. BUYZA Grand Resort"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Headquarters Address</label>
                    <textarea 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      rows={3}
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm resize-none"
                      placeholder="Full street address..."
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-3xl font-black text-slate-900 mb-2">System Activation</h3>
                <p className="text-slate-500 text-sm mb-10">Bind this installation to your enterprise license key.</p>
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-4 items-center mb-4">
                    <i className="fa-solid fa-circle-info text-blue-500 text-xl"></i>
                    <p className="text-xs text-blue-700 font-medium">Licenses are PC-locked. Ensure this is the correct machine for installation.</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Enterprise Key</label>
                    <input 
                      type="text" 
                      value={formData.licenseKey}
                      onChange={(e) => setFormData({...formData, licenseKey: e.target.value.toUpperCase()})}
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono shadow-sm"
                      placeholder="HOTELLO-XXXX-XXXX-XXXX-HOTELLO"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-3xl font-black text-slate-900 mb-2">Master Admin</h3>
                <p className="text-slate-500 text-sm mb-10">Configure the highest privilege account for initial setup.</p>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">System Username</label>
                    <input 
                      type="text" 
                      readOnly
                      value={formData.adminUser}
                      className="w-full px-5 py-4 bg-slate-100 border border-slate-200 rounded-2xl outline-none text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Security Password</label>
                    <input 
                      type="password" 
                      value={formData.adminPass}
                      onChange={(e) => setFormData({...formData, adminPass: e.target.value})}
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                      placeholder="Minimum 6 characters"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-16 flex justify-between items-center">
              <div>
                {error && (
                  <div className="flex items-center gap-2 text-red-500 font-bold text-xs animate-bounce">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <span>{error}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => step > 1 && setStep(step - 1)}
                  className={`px-6 py-4 rounded-2xl text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors ${step === 1 ? 'invisible' : ''}`}
                >
                  Previous
                </button>
                <button 
                  onClick={handleNext}
                  className="px-10 py-4 bg-slate-900 text-white rounded-[20px] font-black shadow-xl shadow-slate-900/20 hover:bg-slate-800 active:scale-95 transition-all flex items-center gap-3"
                >
                  {step === 3 ? 'Deploy Foundation' : 'Continue'}
                  <i className="fa-solid fa-chevron-right text-[10px]"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupWizard;
