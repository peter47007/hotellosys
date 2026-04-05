
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (username: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLogin(username, password);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-inter">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#f16522] rounded-full blur-[160px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#004aad] rounded-full blur-[160px]"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="p-10 md:p-14">
          <div className="flex justify-center mb-10 relative">
            <div className="w-20 h-20 rounded-[28px] flex items-center justify-center text-white shadow-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#004aad] to-[#f16522]"></div>
              <i className="fa-solid fa-b text-4xl relative z-10 font-black"></i>
            </div>
            
            {/* Security Hint for Local Testing */}
            <button 
              onClick={() => setShowHint(!showHint)}
              className="absolute -right-4 top-0 w-10 h-10 bg-blue-50 text-blue-600 rounded-full border border-blue-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
            >
               <i className={`fa-solid ${showHint ? 'fa-times' : 'fa-circle-info'}`}></i>
            </button>
          </div>

          {showHint && (
            <div className="mb-10 p-6 bg-slate-900 text-white rounded-3xl animate-in zoom-in-95 duration-300 border border-blue-500/30">
               <h4 className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-4">Test Credentials</h4>
               <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                     <span className="opacity-50 font-bold">Root Account</span>
                     <code className="font-black text-emerald-400">buyza_root</code>
                  </div>
                  <div className="flex justify-between text-[10px] mb-4">
                     <span className="opacity-50">Master Key:</span>
                     <code className="font-black">BUYZA-MASTER-2026</code>
                  </div>
                  <div className="flex justify-between text-xs border-t border-white/10 pt-3">
                     <span className="opacity-50 font-bold">Manager</span>
                     <code className="font-black text-blue-400">admin</code>
                  </div>
                  <div className="flex justify-between text-xs">
                     <span className="opacity-50 font-bold">Chef</span>
                     <code className="font-black text-amber-400">chef</code>
                  </div>
               </div>
            </div>
          )}

          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2 leading-none">HotelloSys</h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Global Gateway Endpoint</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Terminal ID</label>
              <div className="relative">
                <i className="fa-solid fa-user-shield absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800" 
                  placeholder="Terminal Username"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Master Key</label>
              <div className="relative">
                <i className="fa-solid fa-key absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black shadow-xl shadow-slate-900/20 hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
            >
              {isLoading ? (
                <i className="fa-solid fa-circle-notch animate-spin text-xl"></i>
              ) : (
                <>
                  <span className="uppercase tracking-widest text-xs">Authorize Entry</span>
                  <i className="fa-solid fa-bolt text-blue-400 text-xs group-hover:scale-125 transition-transform"></i>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
            buyza intelligence &copy; 2026 | Enterprise Edition
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
