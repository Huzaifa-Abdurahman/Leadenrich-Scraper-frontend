'use client';

import React, { useState, useEffect } from 'react';
import { 
  Key, Shield, LogIn, Plus, RefreshCw, 
  CheckCircle2, AlertCircle, Trash2, Zap, ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const API_URL = '/api/proxy';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        setIsLoggedIn(true);
        fetchKeys();
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const fetchKeys = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/keys`);
      const data = await res.json();
      setKeys(data);
    } catch (err) {
      console.error(err);
    }
  };

  const generateKey = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/generate-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        fetchKeys();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-8 animate-appear">
          <div className="text-center space-y-4">
             <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center mx-auto text-cyan-400 border border-cyan-500/20">
                <Shield size={40} />
             </div>
             <h1 className="text-3xl font-black text-white tracking-tighter">Admin Portal</h1>
             <p className="text-slate-500 font-light">Enter credentials to manage access protocols.</p>
          </div>

          <form onSubmit={handleLogin} className="glass-panel p-8 rounded-[2rem] border-white/5 space-y-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-cyan-500/40 outline-none transition-all"
                  placeholder="Huzaifa"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-cyan-500/40 outline-none transition-all"
                  placeholder="••••••••"
                />
             </div>
             {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center">{error}</div>}
             <button 
               type="submit" 
               disabled={loading}
               className="btn-primary w-full !py-4 !rounded-xl flex items-center justify-center gap-2"
             >
               {loading ? <RefreshCw className="animate-spin" size={18} /> : <LogIn size={18} />}
               Authorize Access
             </button>
          </form>
          
          <div className="text-center">
            <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-cyan-400 transition-colors flex items-center justify-center gap-2">
               <ArrowLeft size={12} /> Back to Terminal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white p-12">
      <div className="max-w-5xl mx-auto space-y-12 animate-appear">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                 <Key size={24} />
              </div>
              <div>
                 <h1 className="text-3xl font-black tracking-tighter">Key Management</h1>
                 <p className="text-slate-500 text-sm font-light uppercase tracking-widest">Protocol: Tester Access Tokens</p>
              </div>
           </div>
           <button 
             onClick={generateKey}
             disabled={loading}
             className="btn-primary !px-8 !py-3 !rounded-full flex items-center gap-2"
           >
             <Plus size={18} /> Generate Protocol Key
           </button>
        </div>

        <div className="grid gap-4">
           {keys.length === 0 ? (
             <div className="glass-panel p-20 rounded-[2.5rem] border-dashed border-white/5 text-center space-y-4">
                <Zap size={48} className="mx-auto text-slate-800" />
                <p className="text-slate-600 font-light italic">No active access protocols generated yet.</p>
             </div>
           ) : (
             keys.map((k, i) => (
               <div key={i} className="glass-panel p-6 rounded-3xl border-white/5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-8">
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Key Hash</span>
                        <code className="text-xl font-mono text-cyan-400 bg-cyan-500/5 px-4 py-1 rounded-lg border border-cyan-500/10 tracking-widest">
                           {k.key}
                        </code>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Allocation</span>
                        <div className="flex items-center gap-2">
                           <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-cyan-500 transition-all duration-1000" 
                                style={{ width: `${(k.uses_left / 3) * 100}%` }}
                              />
                           </div>
                           <span className="text-xs font-bold text-white">{k.uses_left} / 3 Uses</span>
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                     <div className="text-right">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">Issued At</span>
                        <span className="text-xs text-slate-400 font-light">{new Date(k.created_at).toLocaleString()}</span>
                     </div>
                     <div className={`p-2 rounded-lg ${k.uses_left > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                        {k.uses_left > 0 ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                     </div>
                  </div>
               </div>
             ))
           )}
        </div>
        
        <div className="pt-10 border-t border-white/5 text-center">
           <Link href="/" className="text-xs font-black uppercase tracking-widest text-slate-600 hover:text-white transition-colors">
              Exit Admin Session
           </Link>
        </div>
      </div>
    </div>
  );
}
