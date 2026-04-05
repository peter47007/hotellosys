// C:\Users\Admin\OneDrive\Desktop\BuyzaProject\hotellosys\src\views\Login.tsx

import React, { useState } from 'react';

interface LoginProps {
  onLogin: (username: string, pass: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-slate-100 z-10 relative">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-lg mx-auto mb-4">
            B
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Log in to manage your Buyza property</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">Username</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              placeholder="e.g. admin"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98]"
          >
            Enter Management Console
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-50">
          <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
            Testing Credentials
          </p>
          <div className="flex justify-between mt-3 text-[10px] font-mono bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-blue-600">User: admin</span>
            <span className="text-slate-500">Pass: admin123</span>
          </div>
        </div>
      </div>

      <p className="absolute bottom-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
        Powered by Buyza Technologies © 2026
      </p>
    </div>
  );
};

export default Login;