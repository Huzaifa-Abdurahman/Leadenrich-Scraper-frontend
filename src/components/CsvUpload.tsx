'use client';

import React, { useState, useEffect } from 'react';
import {
  AlertCircle, CheckCircle2, FileSpreadsheet,
  X, Loader2, CloudUpload, Type, Shield, Sparkles, Download
} from 'lucide-react';
import Link from 'next/link';

interface CsvUploadProps {
  onJobCreated: (jobId: string) => void;
}

type Tab = 'csv' | 'manual';
type Stage = 'idle' | 'submitting' | 'done' | 'error';

const SESSION_KEY = 'leadenrich_session_id';

export default function CsvUpload({ onJobCreated }: CsvUploadProps) {
  const [tab, setTab] = useState<Tab>('manual');
  const [stage, setStage] = useState<Stage>('idle');
  const [error, setError] = useState<string | null>(null);
  const [manualText, setManualText] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [usesLeft, setUsesLeft] = useState<number | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const API_URL = '/api/proxy';

  const sessionHeaders = (sid: string) => ({
    'X-Session-Id': sid,
  });

  useEffect(() => {
    const initSession = async () => {
      setLoadingSession(true);
      setError(null);
      try {
        const stored = typeof window !== 'undefined'
          ? localStorage.getItem(SESSION_KEY)
          : null;

        const res = await fetch(`${API_URL}/session`, {
          headers: stored ? sessionHeaders(stored) : {},
        });
        const data = await res.json();
        if (data.success && data.session_id) {
          localStorage.setItem(SESSION_KEY, data.session_id);
          setSessionId(data.session_id);
          setUsesLeft(data.uses_left);
        } else {
          setError('Could not start. Please refresh the page.');
        }
      } catch {
        setError('Could not connect. Please check your internet and try again.');
      } finally {
        setLoadingSession(false);
      }
    };
    initSession();
  }, []);

  const canScrape = Boolean(sessionId && usesLeft !== null && usesLeft > 0);

  const handleCsvSubmit = async (file: File) => {
    if (!sessionId || !canScrape) return;
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV spreadsheet file (.csv)');
      return;
    }

    setStage('submitting');
    setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: sessionHeaders(sessionId),
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        throw new Error(data.detail || 'You have used all 3 free searches on this browser.');
      }
      if (!res.ok) throw new Error(data.detail || 'Upload failed. Please try again.');
      if (typeof data.uses_left === 'number') setUsesLeft(data.uses_left);
      setStage('done');
      setTimeout(() => onJobCreated(data.job_id), 800);
    } catch (err: any) {
      setError(err.message);
      setStage('error');
    }
  };

  const handleManualSubmit = async () => {
    if (!sessionId || !canScrape) return;
    const domains = manualText.split('\n').map(d => d.trim()).filter(d => d.length > 0);
    if (domains.length === 0) {
      setError('Please enter at least one website');
      return;
    }
    if (domains.length > 10) {
      setError('You can search up to 10 websites at a time');
      return;
    }

    setStage('submitting');
    setError(null);
    try {
      const res = await fetch(`${API_URL}/manual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...sessionHeaders(sessionId),
        },
        body: JSON.stringify({ domains }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        throw new Error(data.detail || 'You have used all 3 free searches on this browser.');
      }
      if (!res.ok) throw new Error(data.detail || 'Something went wrong. Please try again.');
      if (typeof data.uses_left === 'number') setUsesLeft(data.uses_left);
      setStage('done');
      setTimeout(() => onJobCreated(data.job_id), 1200);
    } catch (err: any) {
      setError(err.message);
      setStage('error');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!canScrape) return;
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleCsvSubmit(file);
  };

  if (loadingSession) {
    return (
      <div className="max-w-2xl mx-auto space-y-8" suppressHydrationWarning>
        <div className="glass-panel p-16 rounded-[2.5rem] border-white/5 text-center space-y-6">
          <Loader2 size={40} className="animate-spin mx-auto text-cyan-400" />
          <p className="text-sm text-slate-400 font-light">
            Getting things ready...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8" suppressHydrationWarning>
      <div className="max-w-md mx-auto space-y-3">
        <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
          {canScrape
            ? <CheckCircle2 size={16} className="text-emerald-400" />
            : <Shield size={16} className="text-amber-400" />}
          {canScrape ? 'Ready to search' : 'Free limit reached'}
        </div>

        <div className={`rounded-2xl border px-6 py-4 text-center ${canScrape ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300' : 'border-amber-500/30 bg-amber-500/5 text-amber-300'}`}>
          <p className="text-2xl font-black tracking-tight">{usesLeft ?? 0} of 3</p>
          <p className="text-xs mt-1 opacity-80">free searches left on this browser</p>
        </div>
      </div>

      {!canScrape ? (
        <div className="glass-panel p-12 rounded-[2.5rem] border-white/5 text-center space-y-6 animate-appear">
          <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto text-slate-500">
            <Shield size={40} />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-slate-200 tracking-tight">You have used your 3 free searches</h3>
            <p className="text-sm text-slate-400 font-light leading-relaxed max-w-sm mx-auto">
              Need more? Message us on WhatsApp and we will help you continue.
            </p>
            <a
              href="https://wa.me/923100043155"
              target="_blank"
              rel="noreferrer"
              className="inline-flex btn-primary !px-8 !py-3 !rounded-full !text-xs mt-2"
            >
              Contact on WhatsApp
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-appear">
          <div className="flex justify-center">
            <div className="p-1.5 bg-white/5 rounded-full border border-white/10 flex gap-2 backdrop-blur-xl shadow-2xl">
              <button
                onClick={() => setTab('manual')}
                className={`flex items-center gap-2 px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  tab === 'manual' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Type size={16} /> Type websites
              </button>
              <button
                onClick={() => setTab('csv')}
                className={`flex items-center gap-2 px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  tab === 'csv' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileSpreadsheet size={16} /> Upload list
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
                  className={`block p-16 text-center cursor-pointer select-none transition-all duration-500 ${isDragging ? 'bg-cyan-500/5' : ''}`}
                >
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleCsvSubmit(e.target.files[0])}
                    disabled={stage === 'submitting'}
                  />
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
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
                        {stage === 'submitting' ? 'Uploading your list...' : 'Drop your spreadsheet here'}
                      </h3>
                      <p className="text-sm text-slate-400 font-light">
                        CSV file with a website / domain column · up to 10 websites
                      </p>
                    </div>
                  </div>
                </label>
              ) : (
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                      Company websites (one per line)
                    </label>
                    <textarea
                      value={manualText}
                      onChange={(e) => setManualText(e.target.value)}
                      placeholder={"example.com\nacme.com\nyour-company.com"}
                      className="w-full h-48 bg-black/40 border border-white/10 rounded-2xl p-6 text-slate-100 text-sm focus:outline-none focus:border-cyan-500/40 transition-all resize-none placeholder:text-white/20 shadow-inner"
                      disabled={stage === 'submitting'}
                    />
                  </div>
                  <button
                    onClick={handleManualSubmit}
                    disabled={stage === 'submitting' || !manualText.trim()}
                    className="btn-primary w-full !py-4 flex items-center justify-center gap-3 !rounded-2xl"
                  >
                    {stage === 'submitting' ? (
                      <><Loader2 className="animate-spin" size={20} /> Searching...</>
                    ) : (
                      <><Sparkles size={18} /> Find contacts</>
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
          <p className="flex-1 font-light">{error}</p>
          <button onClick={() => setError(null)} className="hover:rotate-90 transition-transform"><X size={18} /></button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="glass-card p-6 flex gap-4 items-start rounded-[1.5rem] border border-white/5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">Automatic lookup</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">We check company pages for emails, phones, and people.</p>
          </div>
        </div>
        <div className="glass-card p-6 flex gap-4 items-start rounded-[1.5rem] border border-white/5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
            <Download size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">Export anytime</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">Download a clean spreadsheet when your search finishes.</p>
          </div>
        </div>
      </div>

      <div className="text-center pt-2">
        <Link href="/docs" className="text-xs text-slate-400 hover:text-cyan-400 transition-colors">
          Prefer technical details? Read the docs →
        </Link>
      </div>
    </div>
  );
}
