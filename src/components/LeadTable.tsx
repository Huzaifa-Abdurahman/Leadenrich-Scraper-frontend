'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronDown, Globe, Mail, Phone, Search, MapPin, 
  Users, Share2, ShieldCheck, Building, Zap, Info
} from 'lucide-react';

interface Representative {
  name: string;
  title: string;
  email: string | null;
}

interface Lead {
  company_name: string;
  website: string;
  emails: string[];
  phones: string[];
  addresses: string[];
  representatives: Representative[];
  socials: string[];
  confidence: string;
  score: number;
  description?: string;
}

interface LeadTableProps {
  leads: Lead[];
}

export default function LeadTable({ leads }: LeadTableProps) {
  const [search, setSearch] = useState('');
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return leads.filter(l => 
      l.company_name?.toLowerCase().includes(search.toLowerCase()) || 
      l.website?.toLowerCase().includes(search.toLowerCase())
    );
  }, [leads, search]);

  return (
    <div className="space-y-6">
      {/* Header Search */}
      <div className="relative group">
        <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-cyan-400/40 group-focus-within:text-cyan-400" />
        <input
          type="text"
          placeholder="Filter extracted intelligence..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 pl-16 pr-8 text-slate-100 placeholder:text-white/20 focus:outline-none focus:border-cyan-500/40"
        />
      </div>

      <div className="grid gap-5">
        {filtered.map((lead, idx) => (
          <div key={idx} className="glass-card overflow-hidden border border-white/5 hover:border-white/20 transition-all">
            <button 
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              className="w-full p-8 flex flex-col sm:flex-row items-center gap-10 text-left"
            >
              <div className="flex flex-col items-center">
                <div className={`text-3xl font-black ${lead.confidence === 'high' ? 'text-emerald-400' : 'text-cyan-400'}`}>
                  {lead.score}%
                </div>
                <div className="text-[9px] uppercase font-bold text-slate-300 tracking-widest mt-1">Accuracy</div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-bold text-slate-100">{lead.company_name}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-y-2 gap-x-8 mt-3">
                  <a href={lead.website} target="_blank" className="text-sm text-cyan-400 flex items-center gap-2 hover:text-cyan-300">
                    <Globe size={16} /> {lead.website?.replace('https://', '')}
                  </a>
                  <span className="text-sm text-slate-200 font-light flex items-center gap-2">
                    <Mail size={16} className="text-cyan-400/30" /> {lead.emails?.[0] || 'No Email'}
                  </span>
                  <span className="text-sm text-slate-200 font-light flex items-center gap-2">
                    <Phone size={16} className="text-cyan-400/30" /> {lead.phones?.[0] || 'No Phone'}
                  </span>
                </div>
              </div>

              <ChevronDown className={`ml-auto text-slate-400 transition-transform ${expandedIdx === idx ? 'rotate-180 text-cyan-400' : ''}`} size={28} />
            </button>

            {expandedIdx === idx && (
              <div className="p-10 border-t border-white/5 bg-black/20 grid md:grid-cols-12 gap-12 animate-appear">
                
                <div className="md:col-span-4 space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-cyan-400/60 uppercase tracking-widest">Validated Channels</h4>
                    <div className="space-y-3">
                      {lead.emails?.map((e, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group">
                          <span className="text-sm font-light text-slate-100">{e}</span>
                          <Mail size={14} className="text-slate-400 group-hover:text-cyan-400" />
                        </div>
                      ))}
                      {lead.phones?.map((p, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group">
                          <span className="text-sm font-light text-slate-100">{p}</span>
                          <Phone size={14} className="text-slate-400 group-hover:text-cyan-400" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-cyan-400/60 uppercase tracking-widest">Physical Presence</h4>
                    <div className="space-y-2">
                      {lead.addresses?.map((a, i) => (
                        <div key={i} className="p-4 bg-white/5 rounded-xl text-sm text-slate-300 font-light leading-relaxed border border-white/5">
                          {a}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-4 space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-cyan-400/60 uppercase tracking-widest">Key Representatives</h4>
                    <div className="space-y-4">
                      {lead.representatives?.map((r, i) => (
                        <div key={i} className="p-5 bg-cyan-500/5 rounded-2xl border border-cyan-500/10">
                          <div className="text-base font-bold text-slate-100">{r.name}</div>
                          <div className="text-[10px] font-black text-cyan-400/60 uppercase tracking-widest">{r.title}</div>
                          {r.email && <div className="text-xs text-slate-400 font-light mt-2">{r.email}</div>}
                        </div>
                      )) || <div className="text-xs text-slate-400 italic">No representative records.</div>}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-cyan-400/60 uppercase tracking-widest">Digital Ecosystem</h4>
                    <div className="flex flex-wrap gap-2">
                      {lead.socials?.map((s, i) => (
                        <a key={i} href={s} target="_blank" className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:text-cyan-400">
                          {s.includes('linkedin') ? 'LINKEDIN' : s.includes('facebook') ? 'FACEBOOK' : 'SOCIAL'}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-4 border-l border-white/5 pl-12 space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-cyan-400/60 uppercase tracking-widest">Data Context</h4>
                    <pre className="text-[11px] text-slate-300 leading-relaxed font-mono whitespace-pre-wrap bg-black/40 p-5 rounded-2xl border border-white/5 border-dashed overflow-hidden">
                      {lead.description || "Extraction completed via Firecrawl V2 Neural Engine. Result reconciled from multiple sources."}
                    </pre>
                    <div className="flex items-center gap-3 text-slate-400 p-2">
                      <ShieldCheck size={16} className="text-emerald-500" />
                      <span className="text-[10px] font-light uppercase tracking-widest">Verified Official Source</span>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
