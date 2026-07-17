'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Zap, Target, Mail, Users,
  ArrowRight, CheckCircle2, ListOrdered, Upload, Download
} from 'lucide-react';

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

function FeatureItem({ title, desc, icon: Icon }: { title: string; desc: string; icon: any }) {
  return (
    <div className="flex gap-4 p-6 glass-card rounded-2xl group" suppressHydrationWarning>
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-500 shrink-0" suppressHydrationWarning>
        <Icon size={24} />
      </div>
      <div className="space-y-1" suppressHydrationWarning>
        <h4 className="text-white font-bold">{title}</h4>
        <p className="text-sm text-slate-300 font-light leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <div className="relative pt-32 pb-20 overflow-hidden" suppressHydrationWarning>
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" suppressHydrationWarning />
      <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none" suppressHydrationWarning />

      <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center" suppressHydrationWarning>
        <div className="space-y-10 animate-appear">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
              Free demo · 3 searches included
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[0.95]">
            Find company contacts <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-indigo-600">
              in just a few clicks.
            </span>
          </h1>

          <p className="text-xl text-slate-300 font-light leading-relaxed max-w-xl">
            Enter a company website and LeadEnrich finds emails, phone numbers,
            and key people for you — ready for your sales outreach.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#how-it-works" className="btn-primary !px-8 !py-4 !text-lg !rounded-full flex items-center gap-3">
              See how it works <ArrowRight size={20} />
            </a>
            <a href="#upload" className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" /> Start free now
            </a>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-10 border-t border-white/5">
            <div>
              <div className="text-3xl font-black text-white"><Counter end={99} suffix="%" /></div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">Data quality</p>
            </div>
            <div>
              <div className="text-3xl font-black text-white"><Counter end={3} suffix="" /></div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">Free searches</p>
            </div>
            <div>
              <div className="text-3xl font-black text-white"><Counter end={10} suffix="" /></div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">Sites per search</p>
            </div>
          </div>
        </div>

        <div className="relative group animate-appear-slow hidden lg:block">
           <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-indigo-600/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
           <div className="relative glass-panel rounded-[3rem] p-12 border-white/10 shadow-2xl space-y-10" suppressHydrationWarning>
              <div className="flex items-center gap-6" suppressHydrationWarning>
                 <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center p-0.5" suppressHydrationWarning>
                   <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center" suppressHydrationWarning>
                     <Users className="text-cyan-400" size={32} />
                   </div>
                 </div>
                 <div suppressHydrationWarning>
                   <h3 className="text-2xl font-black text-white tracking-tight">What you get</h3>
                   <p className="text-cyan-400/80 text-xs font-bold uppercase tracking-widest">Emails · Phones · People</p>
                 </div>
              </div>

              <div className="grid gap-4">
                 <FeatureItem
                   icon={Mail}
                   title="Business emails"
                   desc="Finds public contact emails from company websites automatically."
                 />
                 <FeatureItem
                   icon={Target}
                   title="Key decision-makers"
                   desc="Surfaces founders, HR, and sales contacts when they appear on the site."
                 />
              </div>

              <div className="p-6 bg-black/40 rounded-3xl border border-white/5 border-dashed">
                 <p className="text-xs text-slate-300 leading-relaxed">
                   Tip: Start with one company website. When you are happy with the result,
                   upload a short list of up to 10 websites at once.
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* Step-by-step guide */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 pt-28 pb-8">
        <div className="text-center mb-14 space-y-4">
          <div className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] uppercase font-black tracking-widest">
            Simple guide
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
            How to use LeadEnrich
          </h2>
          <p className="max-w-2xl mx-auto text-slate-300 font-light text-lg">
            Four easy steps — no technical skills needed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StepCard
            step="1"
            icon={ListOrdered}
            title="Add websites"
            desc="Type company website addresses (one per line), or upload a spreadsheet with a website column."
          />
          <StepCard
            step="2"
            icon={Zap}
            title="Start the search"
            desc="Click the start button. We look through each company site for contact details."
          />
          <StepCard
            step="3"
            icon={Upload}
            title="Wait a moment"
            desc="You will see progress while we work. Most searches finish in about a minute."
          />
          <StepCard
            step="4"
            icon={Download}
            title="Download results"
            desc="Open your results page and download a spreadsheet of emails, phones, and contacts."
          />
        </div>
      </section>
    </div>
  );
}

function StepCard({ step, icon: Icon, title, desc }: { step: string; icon: any; title: string; desc: string }) {
  return (
    <div className="glass-panel p-8 rounded-[2rem] border-white/5 space-y-5 hover:bg-white/[0.03] transition-colors h-full">
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
          <Icon size={22} />
        </div>
        <span className="text-4xl font-black text-white/10">{step}</span>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-sm text-slate-300 font-light leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
