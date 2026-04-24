'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Download, Users, Zap, Globe, AlertCircle, Loader2, FileText, Terminal
} from 'lucide-react';
import LeadTable from '@/components/LeadTable';

function CtaModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-appear" onClick={onClose} />
      <div className="relative glass-panel p-10 md:p-16 rounded-[3rem] border-white/10 max-w-xl w-full text-center space-y-8 animate-appear-slow shadow-[0_0_100px_rgba(14,165,233,0.15)]">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl">
           <Zap size={32} className="text-white fill-white" />
        </div>
        
        <div className="space-y-4">
           <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-tight">
             Need Custom <br />
             <span className="text-cyan-400">Software Solutions?</span>
           </h2>
           <p className="text-slate-400 font-light leading-relaxed">
             Our team at <span className="text-white font-bold">Galaxy Software Hub</span> specializes in building world-class Agentic AI systems, SaaS platforms, and enterprise-grade automation.
           </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
           <a 
             href="https://wa.me/923100043155" 
             target="_blank"
             className="flex-1 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20"
           >
             <Phone size={16} /> WhatsApp Us
           </a>
           <a 
             href="mailto:huzabdur@gmail.com" 
             className="flex-1 px-8 py-4 bg-white hover:bg-slate-100 text-black text-xs font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3"
           >
             <Mail size={16} /> Send Email
           </a>
        </div>

        <button 
          onClick={onClose}
          className="text-[10px] uppercase font-black tracking-widest text-slate-600 hover:text-white transition-colors"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCtaOpen, setIsCtaOpen] = useState(false);

  // Use internal proxy to bypass browser extension interference
  const API_URL = '/api/proxy';

  useEffect(() => {
    if (!jobId) return;

    let pollInterval: NodeJS.Timeout;
    let ctaTimeout: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/status/${jobId}`, {
          mode: 'cors',
          cache: 'no-store'
        });
        
        if (!res.ok) {
           const errMsg = `Backend returned status ${res.status}`;
           console.warn(`🔄 ${errMsg}... Retrying...`);
           setError(errMsg);
           setLoading(false);
           return;
        }

        const json = await res.json();
        
        if (!json || typeof json !== 'object') {
          setError('Invalid response from backend');
          setLoading(false);
          return;
        }
        
        setData(json);
        setError(null);
        
        if (json.status === 'completed' || json.status === 'failed') {
          console.log("✅ Extraction Complete. Stopping live sync.");
          clearInterval(pollInterval);
          
          // Trigger CTA after 20 seconds of showing results
          ctaTimeout = setTimeout(() => {
            setIsCtaOpen(true);
          }, 20000);
        }
      } catch (err: any) {
        console.error('❌ Sync interrupted:', err);
        setError(`Connection error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    pollInterval = setInterval(fetchData, 2500);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(ctaTimeout);
    };
  }, [jobId, API_URL]);

  // IMPROVED: Only show dashboard when we have actual results or the job is done
  const isInitialProcessing = data && data.status === 'processing' && data.results?.length === 0;

  if (loading || !data || isInitialProcessing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#030303]" suppressHydrationWarning>
        <div className="relative">
           <div className="w-16 h-16 rounded-full border-4 border-cyan-500/10 border-t-cyan-500 animate-spin" />
           <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-500" size={24} />
        </div>
        <div className="text-center space-y-2">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-100 animate-pulse">
            {isInitialProcessing ? 'Deploying Neural Workers...' : 'Synchronizing Intelligence...'}
          </p>
          {isInitialProcessing && (
            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Mapping domain structures in real-time</p>
          )}
        </div>
      </div>
    );
  }


  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#030303]" suppressHydrationWarning>
        <div className="glass-panel p-12 rounded-[2.5rem] border-red-500/10 text-center space-y-6 max-w-md">
          <div className="w-20 h-20 bg-red-500/5 rounded-3xl flex items-center justify-center mx-auto text-red-500">
            <AlertCircle size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">Connectivity Lost</h2>
            <p className="text-sm text-slate-500 font-light leading-relaxed">
              The intelligence hub is currently unreachable. Ensure the FastAPI backend is running on port 8000.
            </p>
            <p className="text-[10px] font-mono p-2 bg-black/40 rounded-lg text-red-400 mt-4">
              DEBUG: {error || 'Resource not found in system'}
            </p>
          </div>
          <Link href="/" className="btn-primary w-full flex items-center justify-center gap-2">
            <ArrowLeft size={16} /> Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const results = data.results || [];
  const totalScore = results.reduce((acc: number, r: any) => acc + (r.score || 0), 0);
  const avgScore = results.length > 0 ? Math.round(totalScore / results.length) : 0;

  return (
    <div className="min-h-screen pb-20 bg-[#030303] text-white" suppressHydrationWarning>
      <CtaModal isOpen={isCtaOpen} onClose={() => setIsCtaOpen(false)} />

      {/* ── MODERN HEADER ────────────────────────── */}
      <header className="sticky top-0 z-[100] px-6 py-5" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto glass-panel rounded-full px-8 py-3 flex items-center justify-between border border-white/10 shadow-2xl">
          <div className="flex items-center gap-4">
            <Link href="/" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
              <ArrowLeft size={18} className="text-slate-400" />
            </Link>
            <div className="hidden sm:block">
              <h1 className="text-xs font-black text-white uppercase tracking-widest">Intelligence Report</h1>
              <p className="text-[9px] font-mono text-cyan-400">ID: {jobId?.slice(0, 12)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button 
              onClick={() => window.location.href = `${API_URL}/download/md/${jobId}`}
              className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 text-slate-300"
            >
              <FileText size={14} /> Markdown
            </button>
            <button 
              onClick={() => window.location.href = `${API_URL}/download/csv/${jobId}`}
              className="btn-primary !py-2.5 !px-8 !text-[10px] !rounded-full !font-black uppercase tracking-widest flex items-center gap-2"
            >
              <Download size={14} /> Full Export
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-6">
        {/* Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-appear">
          <StatWidget icon={Globe} title="Domains" value={data.total} color="text-cyan-400" />
          <StatWidget icon={Users} title="Success" value={data.completed} color="text-emerald-400" />
          <StatWidget icon={AlertCircle} title="Failed" value={data.errors} color="text-red-400" />
          <StatWidget icon={Zap} title="Efficiency" value={`${avgScore}%`} color="text-indigo-400" />
        </div>

        {/* Results Lead Table */}
        <div className="animate-appear-slow">
           <div className="mb-6 flex items-center gap-3">
              <Terminal size={18} className="text-cyan-500" />
              <h2 className="text-lg font-bold text-white tracking-tight">Harvested Leads</h2>
              <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-slate-500">
                 {results.length} ENTRIES FOUND
              </div>
           </div>
           <LeadTable leads={results} />
        </div>
      </main>
    </div>
  );
}

function StatWidget({ icon: Icon, title, value, color }: any) {
  return (
    <div className="glass-panel p-6 rounded-[1.5rem] border-white/5 flex items-center gap-5 hover:bg-white/[0.04] transition-colors group">
      <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <div>
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{title}</div>
        <div className="text-2xl font-black text-white tracking-tighter leading-none">{value}</div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#030303]">
        <Loader2 className="animate-spin text-cyan-400" size={48} />
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
