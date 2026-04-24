'use client';

import React, { useState } from 'react';
import {
  AlertCircle, CheckCircle2, FileSpreadsheet,
  X, Loader2, CloudUpload, Type, LayoutGrid, Zap, Sparkles, Key, Shield, Mail
} from 'lucide-react';
import Link from 'next/link';


interface CsvUploadProps {
  onJobCreated: (jobId: string) => void;
}

type Tab = 'csv' | 'manual';
type Stage = 'idle' | 'submitting' | 'done' | 'error';

export default function CsvUpload({ onJobCreated }: CsvUploadProps) {
  const [tab, setTab] = useState<Tab>('csv');
  const [stage, setStage] = useState<Stage>('idle');
  const [error, setError] = useState<string | null>(null);
  const [manualText, setManualText] = useState('');
  
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [accessKey, setAccessKey] = useState('');
  
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [usesLeft, setUsesLeft] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const API_URL = '/api/proxy';

  const handleRequestCode = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setIsVerifying(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/request-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setIsCodeSent(true);
      } else {
        setError(data.message || 'Failed to send code');
      }
    } catch (err) {
      setError('Connection failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) return;
    setIsVerifying(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      });
      const data = await res.json();
      if (data.success) {
        setIsVerified(true);
        setAccessKey(data.key);
        setUsesLeft(data.uses_left);
      } else {
        setError(data.message || 'Invalid Verification Code');
      }
    } catch (err) {
      setError('Connection failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCsvSubmit = async (file: File) => {
    if (!isVerified) return;
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a .csv file');
      return;
    }

    setStage('submitting');
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${API_URL}/upload?access_key=${accessKey}`, {
        method: 'POST',
        body: form,
      });
      if (res.status === 401) throw new Error('Invalid or Expired Access Key');
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setStage('done');
      setTimeout(() => onJobCreated(data.job_id), 800);
    } catch (err: any) {
      setError(err.message);
      setStage('error');
    }
  };

  const handleManualSubmit = async () => {
    if (!isVerified) return;
    const domains = manualText.split('\n').map(d => d.trim()).filter(d => d.length > 0);
    if (domains.length === 0) {
      setError('Please enter at least one domain');
      return;
    }
    if (domains.length > 10) {
      setError('Maximum 10 domains allowed per protocol session');
      return;
    }

    setStage('submitting');
    try {
      const res = await fetch(`${API_URL}/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domains, access_key: accessKey }),
      });
      if (res.status === 401) throw new Error('Invalid or Expired Access Key');
      if (!res.ok) throw new Error('Submission failed');
      const data = await res.json();
      setStage('done');
      setTimeout(() => onJobCreated(data.job_id), 1200);
    } catch (err: any) {
      setError(err.message);
      setStage('error');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isVerified) return;
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleCsvSubmit(file);
  };

  return (
    <div id="upload" className="max-w-2xl mx-auto space-y-8" suppressHydrationWarning>
      
      {/* ── LEAD CAPTURE / VERIFICATION SECTION ───────────────────────── */}
      <div className="max-w-md mx-auto space-y-4">
         <div className="flex items-center justify-between px-1">
            <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
               {isVerified ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Mail size={12} className="text-cyan-500" />} 
               {isVerified ? "Access Authorized" : isCodeSent ? "Verification Required" : "Unlock Free Extraction"}
            </label>
         </div>
         
         {!isVerified ? (
           <div className="space-y-3">
             <div className="flex gap-3">
                <div className="relative flex-1 group">
                   <div className="absolute -inset-0.5 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity bg-cyan-500/20" />
                   <input 
                      type={isCodeSent ? "text" : "email"}
                      value={isCodeSent ? verificationCode : email}
                      onChange={(e) => isCodeSent ? setVerificationCode(e.target.value.toUpperCase()) : setEmail(e.target.value)}
                      disabled={isVerifying}
                      placeholder={isCodeSent ? "ENTER 6-DIGIT CODE" : "YOUR EMAIL ADDRESS"}
                      className="relative w-full bg-black/60 border border-white/10 rounded-xl py-4 px-6 text-center text-sm font-mono tracking-[0.1em] outline-none transition-all focus:border-cyan-500/40"
                   />
                </div>
                <button 
                  onClick={isCodeSent ? handleVerifyCode : handleRequestCode}
                  disabled={isVerifying || (isCodeSent ? !verificationCode : !email)}
                  className="px-6 bg-cyan-500 hover:bg-cyan-400 disabled:bg-white/5 disabled:text-slate-400 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                >
                  {isVerifying ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} fill="currentColor" />}
                  {isCodeSent ? "Verify" : "Get Code"}
                </button>
             </div>
             {isCodeSent && (
               <p className="text-[9px] text-center text-slate-300 uppercase tracking-widest font-bold">
                 Check your inbox for the access code.
               </p>
             )}
           </div>
         ) : (
           <div className="animate-appear">
             <div className="relative group">
                <div className="absolute -inset-0.5 rounded-xl blur opacity-100 transition-opacity bg-emerald-500/20" />
                <div className="relative w-full bg-black/60 border border-emerald-500/40 rounded-xl py-4 px-6 text-center text-sm font-mono tracking-[0.3em] text-emerald-400">
                  {accessKey}
                </div>
             </div>
             {usesLeft !== null && (
                <div className="mt-4 flex items-center justify-center gap-4">
                   <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-emerald-500/20" />
                   <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.2em]">
                     {usesLeft} Credits Remaining
                   </span>
                   <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-emerald-500/20" />
                </div>
             )}
           </div>
         )}
      </div>

      {!isVerified ? (
        <div className="glass-panel p-16 rounded-[2.5rem] border-white/5 text-center space-y-6 animate-appear">
           <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto text-slate-500">
              <Shield size={40} />
           </div>
           <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-300 tracking-tight">Lead Capture Active</h3>
              <p className="text-xs text-slate-400 font-light uppercase tracking-widest">Verify your email to unlock the neural extraction engine.</p>
           </div>
        </div>
      ) : (
        <div className="space-y-8 animate-appear">
          {/* ── TAB SELECTOR ───────────────────────── */}
          <div className="flex justify-center">
            <div className="p-1.5 bg-white/5 rounded-full border border-white/10 flex gap-2 backdrop-blur-xl shadow-2xl">
              <button
                onClick={() => setTab('csv')}
                className={`flex items-center gap-2 px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  tab === 'csv' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileSpreadsheet size={16} /> Batch Upload
              </button>
              <button
                onClick={() => setTab('manual')}
                className={`flex items-center gap-2 px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  tab === 'manual' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Type size={16} /> Direct Input
              </button>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-[2rem] opacity-20 blur group-hover:opacity-40 transition-opacity" />
            <div className="relative glass-panel rounded-[2rem] overflow-hidden border-white/5 shadow-inner">
              {tab === 'csv' ? (
                <label
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`block p-20 text-center cursor-pointer select-none transition-all duration-500 ${isDragging ? 'bg-cyan-500/5' : ''}`}
                >
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleCsvSubmit(e.target.files[0])}
                    disabled={stage === 'submitting'}
                  />
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-cyan-500 group-hover:scale-110 group-hover:-rotate-12 transition-transform">
                      {stage === 'submitting' ? (
                        <Loader2 size={32} className="animate-spin" />
                      ) : stage === 'done' ? (
                        <CheckCircle2 size={32} className="text-emerald-400" />
                      ) : (
                        <CloudUpload size={32} />
                      )}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white tracking-tight">
                        {stage === 'submitting' ? 'Uploading Pipeline...' : 'Upload Lead CSV'}
                      </h3>
                      <p className="text-sm text-slate-400 font-light italic">Supports up to 10 domains per protocol session</p>
                    </div>
                  </div>
                </label>
              ) : (
                <div className="p-8 space-y-6">
                  <div className="relative">
                    <textarea
                      value={manualText}
                      onChange={(e) => setManualText(e.target.value)}
                      placeholder="domain-one.com&#10;domain-two.io&#10;target-company.net"
                      className="w-full h-48 bg-black/40 border border-white/10 rounded-2xl p-6 text-slate-100 text-sm focus:outline-none focus:border-cyan-500/40 transition-all resize-none placeholder:text-white/10 font-mono shadow-inner"
                      disabled={stage === 'submitting'}
                    />
                    <div className="absolute top-4 right-4 text-[10px] uppercase font-black tracking-widest text-white/5 pointer-events-none">
                      Manual Entry Cluster
                    </div>
                  </div>
                  <button
                    onClick={handleManualSubmit}
                    disabled={stage === 'submitting' || !manualText.trim()}
                    className="btn-primary w-full !py-4 flex items-center justify-center gap-3 !rounded-2xl"
                  >
                    {stage === 'submitting' ? (
                      <><Loader2 className="animate-spin" size={20} /> Deploying Workers...</>
                    ) : (
                      <><Zap size={18} fill="currentColor" /> Launch Extraction Engine</>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-4 p-5 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-400 text-sm animate-appear">
          <AlertCircle size={20} className="shrink-0" />
          <p className="flex-1 font-light italic">{error}</p>
          <button onClick={() => setError(null)} className="hover:rotate-90 transition-transform"><X size={18} /></button>
        </div>
      )}

      {/* Feature Grid */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="glass-card p-6 flex gap-4 items-start rounded-[1.5rem] border border-white/5">
           <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
             <Sparkles size={20} />
           </div>
           <div>
             <h4 className="text-sm font-bold text-white mb-1">Selenium Engine V2</h4>
             <p className="text-xs text-slate-400 leading-relaxed font-light italic">Agentic AI-driven deep site reconnaissance.</p>
           </div>
        </div>
        <div className="glass-card p-6 flex gap-4 items-start rounded-[1.5rem] border border-white/5">
           <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
             <LayoutGrid size={20} />
           </div>
           <div>
             <h4 className="text-sm font-bold text-white mb-1">Parallel Clusters</h4>
             <p className="text-xs text-slate-400 leading-relaxed font-light italic">Concurrent domain processing for high-volume batches.</p>
           </div>
        </div>
      </div>

      <div className="text-center pt-4">
         <Link href="/docs" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-cyan-400 transition-colors">
            System Documentation & Architecture
         </Link>
      </div>
    </div>
  );

