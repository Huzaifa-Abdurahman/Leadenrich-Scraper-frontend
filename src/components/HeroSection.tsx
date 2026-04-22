'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Zap, Target, Globe, Brain, Shield,
  ArrowRight, Sparkles, BarChart3, CheckCircle2
} from 'lucide-react';

/* ─── Animated counter ───────────────────────── */
function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = Math.ceil(end / 60);
        const id = setInterval(() => {
          start += step;
          if (start >= end) { setVal(end); clearInterval(id); }
          else setVal(start);
        }, 16);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ─── Feature row ────────────────────────────── */
function FeatureItem({ title, desc, icon: Icon }: { title: string; desc: string; icon: any }) {
  return (
    <div className="flex gap-4 p-6 glass-card rounded-2xl group" suppressHydrationWarning>
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-500 shrink-0" suppressHydrationWarning>
        <Icon size={24} />
      </div>
      <div className="space-y-1" suppressHydrationWarning>
        <h4 className="text-white font-bold">{title}</h4>
        <p className="text-sm text-slate-500 font-light leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

export default function HeroSection() {
  return (
    <div className="relative pt-32 pb-20 overflow-hidden" suppressHydrationWarning>
      {/* Background Decorative */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" suppressHydrationWarning />
      <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none" suppressHydrationWarning />

      <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center" suppressHydrationWarning>
        <div className="space-y-10 animate-appear">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
              Direct Firecrawl V2 Integration
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9]">
            The New Standard <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-indigo-600">
              In Lead Mining.
            </span>
          </h1>

          <p className="text-xl text-slate-400 font-light leading-relaxed max-w-xl">
            Transform raw company URLs into deep, validated contact intelligence. 
            Automate discovery, extraction, and validation in a single neural pipeline.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#upload" className="btn-primary !px-8 !py-4 !text-lg !rounded-full flex items-center gap-3">
              Start Extraction <ArrowRight size={20} />
            </a>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <CheckCircle2 size={18} className="text-emerald-500" /> No API key req. for Demo
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-10 border-t border-white/5">
            <div>
              <div className="text-3xl font-black text-white"><Counter end={99} suffix="%" /></div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1">Accuracy</p>
            </div>
            <div>
              <div className="text-3xl font-black text-white"><Counter end={100} suffix="k+" /></div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1">Domains Proxied</p>
            </div>
            <div>
              <div className="text-3xl font-black text-white"><Counter end={450} suffix="ms" /></div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1">Latency</p>
            </div>
          </div>
        </div>

        {/* Hero Visual Card */}
        <div className="relative group animate-appear-slow hidden lg:block">
           <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-indigo-600/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
           <div className="relative glass-panel rounded-[3rem] p-12 border-white/10 shadow-2xl space-y-10" suppressHydrationWarning>
              <div className="flex items-center gap-6" suppressHydrationWarning>
                 <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center p-0.5" suppressHydrationWarning>
                   <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center" suppressHydrationWarning>
                     <Brain className="text-cyan-400" size={32} />
                   </div>
                 </div>
                 <div suppressHydrationWarning>
                   <h3 className="text-2xl font-black text-white tracking-tight">Neural Extractor v2</h3>
                   <p className="text-cyan-400/60 text-xs font-black uppercase tracking-widest">Active Sitemap Mapping</p>
                 </div>
              </div>

              <div className="grid gap-4">
                 <FeatureItem 
                   icon={Target} 
                   title="Contact Harvesting" 
                   desc="Identifies Founders, HR, and Sales leads with high-confidence verification." 
                 />
                 <FeatureItem 
                   icon={Shield} 
                   title="Anti-Bot Bypass" 
                   desc="Smart rotation and human-like interaction to navigate enterprise firewalls." 
                 />
              </div>

              <div className="p-6 bg-black/40 rounded-3xl border border-white/5 border-dashed">
                 <p className="text-xs text-slate-500 leading-relaxed italic">
                   "The engine automatically navigated to /about and /careers, identified the CEO 
                   and Head of Talent, and recovered 3 validated work emails in 4.2 seconds."
                 </p>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
