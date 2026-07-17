'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Cpu, Globe, Zap, Shield, Mail, Phone,
  ExternalLink, Code2, Rocket, Layers, Database, Server
} from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-cyan-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      <header className="sticky top-0 z-50 px-6 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all">
            <ArrowLeft size={18} className="text-slate-300 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to home</span>
          </Link>
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500">Technical documentation</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-24">

        <section className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
              TECHNICAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">DOCS</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl font-light leading-relaxed">
              LeadEnrich is an AI-assisted contact enrichment platform. It maps company websites,
              extracts structured contact data (emails, phones, people), and returns downloadable reports.
              This page covers architecture and stack details for technical stakeholders.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Cpu}
              title="AI extraction"
              desc="Uses Firecrawl extract with a typed JSON schema to pull contacts from mapped pages and optional web search context."
            />
            <FeatureCard
              icon={Globe}
              title="Site mapping"
              desc="Maps each domain (including contact/about/careers style paths) before extraction to improve coverage."
            />
            <FeatureCard
              icon={Shield}
              title="Session quotas"
              desc="Browser sessions are tracked with a 3-search free limit via X-Session-Id; jobs run asynchronously in the API."
            />
          </div>
        </section>

        <section className="glass-panel p-12 rounded-[2.5rem] border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Code2 size={120} />
          </div>
          <h2 className="text-3xl font-black mb-12 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
               <Zap size={20} />
            </div>
            Technology stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StackItem label="Frontend" value="Next.js 15 & TypeScript" />
            <StackItem label="Backend API" value="FastAPI (Python)" />
            <StackItem label="Extraction" value="Firecrawl API v2" />
            <StackItem label="AI schema" value="Structured JSON extract" />
            <StackItem label="Styling" value="Tailwind CSS" />
            <StackItem label="Proxy" value="Next.js API route proxy" />
            <StackItem label="Concurrency" value="Async job workers" />
            <StackItem label="Deploy" value="Vercel & Render" />
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-black flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Layers size={20} />
            </div>
            How the pipeline works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <PipelineCard
              icon={Server}
              title="1. Ingest"
              desc="POST /api/manual or /api/upload accepts domains, validates the browser session, and creates a background job."
            />
            <PipelineCard
              icon={Globe}
              title="2. Map + extract"
              desc="Firecrawl /map discovers pages; /extract pulls contacts with schema fields like emails, phones, and representatives."
            />
            <PipelineCard
              icon={Database}
              title="3. Deliver"
              desc="Clients poll /api/status/{job_id}. Results export as CSV or Markdown via download endpoints."
            />
          </div>
        </section>

        <section className="space-y-12 pb-20">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition-opacity" />
               <div className="relative w-64 h-64 bg-slate-900 rounded-[3rem] border border-white/10 flex items-center justify-center overflow-hidden">
                  <div className="text-7xl font-black text-white/20">H</div>
                  <div className="absolute inset-4 border border-cyan-500/20 rounded-full border-dashed animate-[spin_20s_linear_infinite]" />
               </div>
            </div>

            <div className="flex-1 space-y-6 text-center md:text-left">
              <div className="space-y-2">
                <span className="px-4 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-cyan-400">
                  Lead AI Engineer
                </span>
                <h2 className="text-5xl font-black text-white">Huzaifa Abdurahman</h2>
                <p className="text-xl font-medium text-indigo-400">Lead AI Engineer · Apexa AI Labs</p>
              </div>
              <p className="text-slate-300 leading-relaxed font-light">
                As Lead AI Engineer at <span className="text-white font-bold">Apexa AI Labs</span>, Huzaifa designs
                production AI systems for enrichment, automation, and intelligent data workflows —
                helping teams turn web data into actionable sales and growth outcomes.
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                <ContactLink icon={Mail} value="huzabdur@gmail.com" href="mailto:huzabdur@gmail.com" />
                <ContactLink icon={Phone} value="+92 310 0043 155" href="tel:+923100043155" />
                <ContactLink icon={ExternalLink} value="apexaailabs.com" href="https://apexaailabs.com" target="_blank" />
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[2rem] bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-cyan-500/20 transition-colors">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <Rocket size={32} />
               </div>
               <div>
                  <h4 className="text-xl font-bold">Apexa AI Labs</h4>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-black">Building practical AI software</p>
               </div>
            </div>
            <Link href="https://apexaailabs.com" target="_blank" className="px-8 py-3 bg-cyan-500 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20">
               Visit apexaailabs.com
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 px-6 bg-black/50 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
           <div className="text-[10px] font-bold uppercase tracking-widest">© 2026 Apexa AI Labs. All rights reserved.</div>
           <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
              <Link href="/" className="hover:text-cyan-400">Home</Link>
              <a href="https://apexaailabs.com" target="_blank" rel="noreferrer" className="hover:text-cyan-400">Company</a>
           </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="glass-panel p-8 rounded-3xl border-white/5 hover:bg-white/[0.04] transition-all group">
      <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <p className="text-sm text-slate-300 leading-relaxed font-light">{desc}</p>
    </div>
  );
}

function PipelineCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="glass-panel p-8 rounded-3xl border-white/5 space-y-4">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-cyan-400">
        <Icon size={20} />
      </div>
      <h3 className="font-bold text-white">{title}</h3>
      <p className="text-sm text-slate-300 font-light leading-relaxed">{desc}</p>
    </div>
  );
}

function StackItem({ label, value }: any) {
  return (
    <div className="space-y-1">
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</div>
      <div className="text-sm font-medium text-white">{value}</div>
    </div>
  );
}

function ContactLink({ icon: Icon, value, href, ...props }: any) {
  return (
    <a
      href={href}
      {...props}
      className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-xs font-bold text-slate-300"
    >
      <Icon size={14} className="text-cyan-400" />
      {value}
    </a>
  );
}
