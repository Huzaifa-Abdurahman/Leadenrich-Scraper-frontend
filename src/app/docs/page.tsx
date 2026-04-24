'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Cpu, Globe, Zap, Shield, Mail, Phone, 
  ExternalLink, Code2, Rocket, Briefcase, Award
} from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-cyan-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      <header className="sticky top-0 z-50 px-6 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all">
            <ArrowLeft size={18} className="text-slate-400 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Engine</span>
          </Link>
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500">System Documentation v2.0</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-24">
        
        {/* Section 1: The Engine */}
        <section className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
              NEURAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">EXTRACTION</span> ENGINE.
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl font-light leading-relaxed">
              LeadEnrich is a high-performance, agentic AI platform designed to transform raw web data into actionable business intelligence through autonomous reconnaissance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Cpu} 
              title="Agentic Reasoning" 
              desc="Utilizes advanced AI agents to understand website structures and identify key decision-makers autonomously."
            />
            <FeatureCard 
              icon={Globe} 
              title="Selenium Clusters" 
              desc="Powered by high-speed Selenium clusters for deep-site navigation and dynamic content rendering."
            />
            <FeatureCard 
              icon={Shield} 
              title="Neural Filtering" 
              desc="Proprietary algorithms filter out noise, delivering only high-confidence contact data and emails."
            />
          </div>
        </section>

        {/* Section 2: Technology Stack */}
        <section className="glass-panel p-12 rounded-[2.5rem] border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Code2 size={120} />
          </div>
          <h2 className="text-3xl font-black mb-12 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
               <Zap size={20} />
            </div>
            The Tech Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StackItem label="Frontend" value="Next.js 15 & TS" />
            <StackItem label="Engine Core" value="FastAPI (Python)" />
            <StackItem label="Scraping" value="Selenium Grid" />
            <StackItem label="Intelligence" value="Agentic AI Models" />
            <StackItem label="Styling" value="Tailwind CSS" />
            <StackItem label="Communication" value="SMTP & Secure Proxy" />
            <StackItem label="Performance" value="Parallel Clusters" />
            <StackItem label="Deployment" value="Vercel & Render" />
          </div>
        </section>

        {/* Section 3: About the Architect */}
        <section className="space-y-12 pb-20">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition-opacity" />
               <div className="relative w-64 h-64 bg-slate-900 rounded-[3rem] border border-white/10 flex items-center justify-center overflow-hidden">
                  <div className="text-7xl font-black text-white/20">H</div>
                  {/* Decorative AI Ring */}
                  <div className="absolute inset-4 border border-cyan-500/20 rounded-full border-dashed animate-[spin_20s_linear_infinite]" />
               </div>
            </div>

            <div className="flex-1 space-y-6 text-center md:text-left">
              <div className="space-y-2">
                <span className="px-4 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-cyan-400">
                  Lead Architect & CEO
                </span>
                <h2 className="text-5xl font-black text-white">Huzaifa</h2>
                <p className="text-xl font-medium text-indigo-400 italic">Expert Full Stack Agentic AI Developer</p>
              </div>
              <p className="text-slate-400 leading-relaxed font-light">
                As the CEO of <span className="text-white font-bold">Galaxy Software Hub</span>, Huzaifa has pioneered the integration of autonomous agents into enterprise workflows. Working with high-growth startups across the globe, he specializes in building scalable, intelligent systems that solve complex data extraction and automation challenges.
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                <ContactLink icon={Mail} value="huzabdur@gmail.com" href="mailto:huzabdur@gmail.com" />
                <ContactLink icon={Phone} value="+92 310 0043 155" href="tel:+923100043155" />
                <ContactLink icon={ExternalLink} value="www.huzaifa.pro" href="https://www.huzaifa.pro" target="_blank" />
              </div>
            </div>
          </div>

          {/* Galaxy Software Hub Banner */}
          <div className="p-8 rounded-[2rem] bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-cyan-500/20 transition-colors">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <Rocket size={32} />
               </div>
               <div>
                  <h4 className="text-xl font-bold">Galaxy Software Hub</h4>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-black">Building the Future of AI Software</p>
               </div>
            </div>
            <Link href="https://www.huzaifa.pro" target="_blank" className="px-8 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-colors">
               Partner with Us
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 px-6 bg-black/50 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
           <div className="text-[10px] font-bold uppercase tracking-widest">© 2026 Galaxy Software Hub. All Rights Reserved.</div>
           <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
              <Link href="#" className="hover:text-cyan-400">Security</Link>
              <Link href="#" className="hover:text-cyan-400">Architecture</Link>
              <Link href="#" className="hover:text-cyan-400">Terms</Link>
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
      <p className="text-sm text-slate-500 leading-relaxed font-light">{desc}</p>
    </div>
  );
}

function StackItem({ label, value }: any) {
  return (
    <div className="space-y-1">
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-600">{label}</div>
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
