'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Loader2, CheckCircle2, Zap, Hourglass, ShieldCheck } from 'lucide-react';

interface ProgressBarProps {
  jobId: string;
  onProgress: (percent: number) => void;
  onComplete: () => void;
}

export default function ProgressBar({ jobId, onProgress, onComplete }: ProgressBarProps) {
  const [status, setStatus] = useState<any>(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Use internal proxy to bypass browser extension interference
  const API_URL = '/api/proxy';

  useEffect(() => {
    // Timer for elapsed seconds
    timerRef.current = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);

    const poll = async () => {
      try {
        const res = await fetch(`${API_URL}/status/${jobId}`);
        if (!res.ok) return;
        const data = await res.json();
        
        setStatus(data);
        
        const total = data.total || 1;
        const finishedCount = data.completed + data.errors;
        const percent = Math.round((finishedCount / total) * 100);
        onProgress(percent);

        if (data.status === 'completed') {
          if (timerRef.current) clearInterval(timerRef.current);
          onComplete();
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    };

    const interval = setInterval(poll, 2500); // Poll every 2.5s for responsiveness
    poll(); 

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      clearInterval(interval);
    };
  }, [jobId, API_URL]);

  if (!status) return (
     <div className="flex flex-col items-center gap-4 py-8 animate-pulse">
       <Loader2 className="text-cyan-500 animate-spin" size={32} />
       <div className="text-xs font-black uppercase tracking-widest text-slate-300">Contacting Backend Clusters...</div>
     </div>
  );

  const total = status.total || 1;
  const progressPercent = Math.min(100, Math.round(((status.completed + status.errors) / total) * 100));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col text-left">
          <div className="text-4xl font-black text-white tracking-tighter transition-all duration-700">
            {progressPercent}%
          </div>
          <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-cyan-400 mt-1">
            Global Progress
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-100">{elapsed}s</div>
          <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-300 mt-1 italic">
            Active Runtime
          </div>
        </div>
      </div>

      {/* Main Track */}
      <div className="relative h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-indigo-600 transition-all duration-1000 ease-out flex items-center justify-end px-2"
          style={{ width: `${progressPercent}%` }}
        >
          <div className="w-1 h-2 bg-white/40 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
         <div className="glass-card p-4 rounded-2xl flex items-center gap-4 border-white/5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${status.errors > 0 ? 'bg-amber-500/10 text-amber-500' : 'bg-cyan-500/10 text-cyan-500'}`}>
              <Zap size={18} fill="currentColor" />
            </div>
            <div className="text-left">
               <div className="text-xs font-black text-white uppercase tracking-wider">{status.completed + status.errors} / {total}</div>
               <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                 {status.errors > 0 ? `${status.completed} Success / ${status.errors} No Data` : 'Domains Processed'}
               </div>
            </div>
         </div>
        <div className="glass-card p-4 rounded-2xl flex items-center gap-4 border-white/5">
           <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
             <ShieldCheck size={18} />
           </div>
           <div className="text-left">
              <div className="text-xs font-black text-white uppercase tracking-wider">{status.results?.length || 0}</div>
              <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Cold Intelligence Found</div>
           </div>
        </div>
      </div>

      {/* Dynamic Status Log */}
      <div className="p-6 bg-black/40 rounded-[1.5rem] border border-white/5 border-dashed flex items-center gap-4 group">
        <div className="w-3 h-3 rounded-full bg-cyan-500 animate-ping" />
        <div className="text-sm font-mono text-slate-300 transition-all duration-300 animate-appear">
          {status.current_action}
        </div>
        <Loader2 className="ml-auto text-white/5 animate-spin group-hover:text-cyan-500/20 transition-colors" size={24} />
      </div>
    </div>
  );
}
