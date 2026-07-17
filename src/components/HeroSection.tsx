'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Zap, Target, Mail, Users,
  ArrowRight, CheckCircle2, ListOrdered, Upload, Download, Phone
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
        <h4 className="text-white font-semibold font-display">{title}</h4>
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
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
              Free demo · 3 searches included
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[0.95] font-display">
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
              <div className="text-3xl font-extrabold text-white font-display"><Counter end={99} suffix="%" /></div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">Data quality</p>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white font-display"><Counter end={3} suffix="" /></div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">Free searches</p>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white font-display"><Counter end={10} suffix="" /></div>
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
                   <h3 className="text-2xl font-bold text-white tracking-tight font-display">What you get</h3>
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

      {/* Step-by-step guide with visual examples */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 pt-28 pb-8">
        <div className="text-center mb-14 space-y-4">
          <div className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] uppercase font-bold tracking-widest">
            Simple guide
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight font-display">
            How to use LeadEnrich
          </h2>
          <p className="max-w-2xl mx-auto text-slate-300 font-light text-lg">
            Four easy steps — see what you type, what happens next, and what you get back.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StepCard
            step="1"
            icon={ListOrdered}
            title="Add websites"
            desc="Type company websites, one per line — or upload a spreadsheet."
            preview={<InputPreview />}
          />
          <StepCard
            step="2"
            icon={Zap}
            title="Start the search"
            desc="Click Find contacts. We look through each company site for details."
            preview={<StartPreview />}
          />
          <StepCard
            step="3"
            icon={Upload}
            title="Wait a moment"
            desc="Watch the progress bar while we work. Usually under a minute."
            preview={<ProcessingPreview />}
          />
          <StepCard
            step="4"
            icon={Download}
            title="Download results"
            desc="Get a clean list of emails, phones, and people to export."
            preview={<OutputPreview />}
          />
        </div>
      </section>
    </div>
  );
}

function StepCard({
  step,
  icon: Icon,
  title,
  desc,
  preview,
}: {
  step: string;
  icon: any;
  title: string;
  desc: string;
  preview: React.ReactNode;
}) {
  return (
    <div className="glass-card p-6 rounded-[1.75rem] space-y-5 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-400/20 flex items-center justify-center text-cyan-300">
          <Icon size={20} />
        </div>
        <span className="text-3xl font-extrabold text-white/15 font-display">{step}</span>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white font-display">{title}</h3>
        <p className="text-sm text-slate-300/90 font-light leading-relaxed">{desc}</p>
      </div>

      <div className="mt-auto pt-1">
        {preview}
      </div>
    </div>
  );
}

function InputPreview() {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/35 p-3 space-y-2">
      <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold px-1">Example input</p>
      <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3 font-mono text-[11px] text-cyan-200/90 leading-6">
        <div>acme.com</div>
        <div>brightlabs.io</div>
        <div>northstar.co</div>
      </div>
    </div>
  );
}

function StartPreview() {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/35 p-4 flex flex-col items-center gap-3">
      <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold self-start">Example action</p>
      <div className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 py-2.5 text-center text-xs font-bold text-white shadow-lg shadow-cyan-500/20">
        Find contacts
      </div>
      <p className="text-[10px] text-slate-400">Up to 10 websites per search</p>
    </div>
  );
}

function ProcessingPreview() {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/35 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Processing</p>
        <span className="text-[10px] text-cyan-300 font-semibold">67%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500" />
      </div>
      <div className="flex items-center gap-2 text-[10px] text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        Checking acme.com…
      </div>
    </div>
  );
}

function OutputPreview() {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/35 p-3 space-y-2">
      <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold px-1">Example output</p>
      <div className="rounded-xl bg-white/[0.04] border border-emerald-500/20 p-3 space-y-2">
        <div className="text-xs font-semibold text-white">Acme Inc.</div>
        <div className="flex items-center gap-2 text-[10px] text-slate-300">
          <Mail size={11} className="text-cyan-400" /> hello@acme.com
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-300">
          <Phone size={11} className="text-cyan-400" /> +1 555 0100
        </div>
        <div className="pt-1">
          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
            <Download size={10} /> Ready to download
          </span>
        </div>
      </div>
    </div>
  );
}
