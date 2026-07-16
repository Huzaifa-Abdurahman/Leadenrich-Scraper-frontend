'use client';

import React, { useState, useEffect } from 'react';
import {
  AlertCircle, CheckCircle2, FileSpreadsheet,
  X, Loader2, CloudUpload, Type, LayoutGrid, Zap, Sparkles, Shield
} from 'lucide-react';
import Link from 'next/link';

interface CsvUploadProps {
  onJobCreated: (jobId: string) => void;
}

type Tab = 'csv' | 'manual';
type Stage = 'idle' | 'submitting' | 'done' | 'error';

const SESSION_KEY = 'leadenrich_session_id';

export default function CsvUpload({ onJobCreated }: CsvUploadProps) {
  const [tab, setTab] = useState<Tab>('csv');
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
          setError('Could not start browser session');
        }
      } catch {
        setError('Connection failed');
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
      setError('Please upload a .csv file');
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
        throw new Error(data.detail || 'Scraping limit reached for this browser (3 free scrapes).');
      }
      if (!res.ok) throw new Error(data.detail || 'Upload failed');
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
      setError('Please enter at least one domain');
      return;
    }
    if (domains.length > 10) {
      setError('Maximum 10 domains allowed per protocol session');
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
        throw new Error(data.detail || 'Scraping limit reached for this browser (3 free scrapes).');
      }
      if (!res.ok) throw new Error(data.detail || 'Submission failed');
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
      <div id="upload" className="max-w-2xl mx-auto space-y-8" suppressHydrationWarning>
        <div className="glass-panel p-16 rounded-[2.5rem] border-white/5 text-center space-y-6">
          <Loader2 size={40} className="animate-spin mx-auto text-cyan-400" />
          <p className="text-xs text-slate-400 font-light uppercase tracking-widest">
            Preparing browser session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="upload" className="max-w-2xl mx-auto space-y-8" suppressHydrationWarning>
      {/* Session quota */}
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex items-center justify-between px-1">
          <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
            {canScrape
              ? <CheckCircle2 size={12} className="text-emerald-400" />
              : <Shield size={12} className="text-amber-400" />}
            {canScrape ? 'Browser Session Active' : 'Session Limit Reached'}
          </label>
        </div>

        <div className="relative group">
          <div className={`absolute -inset-0.5 rounded-xl blur opacity-100 transition-opacity ${canScrape ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`} />
          <div className={`relative w-full bg-black/60 border rounded-xl py-4 px-6 text-center text-sm font-mono tracking-[0.2em] ${canScrape ? 'border-emerald-500/40 text-emerald-400' : 'border-amber-500/40 text-amber-400'}`}>
            {usesLeft ?? 0} / 3 FREE SCRAPES LEFT
          </div>
        </div>
        <p className="text-[9px] text-center text-slate-400 uppercase tracking-widest font-bold">
          Limit applies to this browser session only.
        </p>
      </div>

      {!canScrape ? (
        <div className="glass-panel p-16 rounded-[2.5rem] border-white/5 text-center space-y-6 animate-appear">
          <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto text-slate-500">
            <Shield size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-300 tracking-tight">Free Limit Reached</h3>
            <p className="text-xs text-slate-400 font-light uppercase tracking-widest">
              This browser has used all 3 free scrapes. Contact us at +923100043155 (WhatsApp) for more.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-appear">
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
}
