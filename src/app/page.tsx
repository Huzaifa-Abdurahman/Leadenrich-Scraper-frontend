'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Zap, LayoutGrid, Search, Clock, Download } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import CsvUpload from '@/components/CsvUpload';
import ProgressBar from '@/components/ProgressBar';

export default function Home() {
  const router = useRouter();
  const [jobId, setJobId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleJobCreated = (id: string) => {
    setJobId(id);
    setIsProcessing(true);
    setProgress(0);
    setTimeout(() => {
      router.push(`/results?jobId=${id}`);
    }, 500);
  };

  return (
    <div className="min-h-screen selection:bg-cyan-500/30" suppressHydrationWarning>
      <header className="fixed top-0 left-0 right-0 z-[100] px-6 py-5" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto glass-panel rounded-full px-8 py-3.5 flex items-center justify-between border border-white/10 shadow-2xl" suppressHydrationWarning>
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-500">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tighter leading-none text-white">LEADENRICH</span>
              <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-cyan-400 mt-0.5">Contact Finder</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-medium text-slate-200 hover:text-white transition-colors">How it works</a>
            <a href="#upload" className="text-sm font-medium text-slate-200 hover:text-white transition-colors">Try it</a>
            <Link href="/docs" className="text-sm font-medium text-slate-200 hover:text-white transition-colors">Docs</Link>
            {jobId && (
              <Link href={`/results?jobId=${jobId}`} className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2">
                <LayoutGrid size={14} /> Your results
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
             <a href="#upload" className="btn-primary !py-2 !px-6 !rounded-full !text-xs !font-black uppercase tracking-widest">
               Get started
             </a>
          </div>
        </div>
      </header>

      <main className="pt-24">
        {!jobId ? (
          <>
            <HeroSection />

            <section id="upload" className="py-24 px-6 relative overflow-hidden">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

               <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-16 space-y-4">
                  <div className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] uppercase font-black tracking-widest animate-appear-slow">
                    Try it free
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
                    Find contacts from <br />
                    <span className="text-cyan-400">company websites.</span>
                  </h2>
                  <p className="max-w-xl mx-auto text-lg text-slate-300 font-light leading-relaxed">
                    Paste websites below, or upload a spreadsheet. You get 3 free searches
                    on this device, with up to 10 websites each time.
                  </p>
                </div>
                <div className="animate-appear">
                   <CsvUpload onJobCreated={handleJobCreated} />
                </div>
              </div>
            </section>

            <section id="features" className="py-24 px-6 border-t border-white/5">
              <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-3 gap-12 text-center">
                   <div className="space-y-4">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-cyan-500">
                        <Search size={24} />
                      </div>
                      <h4 className="text-white font-bold">Smart website search</h4>
                       <p className="text-sm text-slate-300 leading-relaxed font-light">We scan company pages to find public contact details you can use.</p>
                   </div>
                   <div className="space-y-4">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-emerald-500">
                        <Clock size={24} />
                      </div>
                      <h4 className="text-white font-bold">Fast results</h4>
                      <p className="text-sm text-slate-300 leading-relaxed font-light">Search several companies at once and get results in minutes, not hours.</p>
                   </div>
                   <div className="space-y-4">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-orange-500">
                        <Download size={24} />
                      </div>
                      <h4 className="text-white font-bold">Easy download</h4>
                      <p className="text-sm text-slate-300 leading-relaxed font-light">Export a clean spreadsheet of emails, phones, and contacts for your team.</p>
                   </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="max-w-3xl mx-auto px-6 py-32 text-center">
            <div className="space-y-12 animate-appear">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> Searching...
                </div>
                <h2 className="text-5xl font-black text-white tracking-tighter">
                  Finding contacts
                </h2>
                <p className="text-slate-400 font-light max-w-md mx-auto">
                  Please wait while we look up contact details on the websites you provided.
                </p>
              </div>

              <div className="glass-panel p-10 rounded-[2.5rem] border-white/5 shadow-2xl">
                <ProgressBar
                  jobId={jobId}
                  onProgress={setProgress}
                  onComplete={() => setIsProcessing(false)}
                />
              </div>

              <div className="pt-8 space-y-6">
                {!isProcessing ? (
                  <Link
                    href={`/results?jobId=${jobId}`}
                    className="btn-primary inline-flex items-center justify-center !px-12 !py-5 !text-lg !rounded-full shadow-[0_0_50px_rgba(14,165,233,0.3)] group transition-all"
                  >
                    <span>View your results</span>
                    <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform" />
                  </Link>
                ) : (
                  <button
                    onClick={() => setJobId(null)}
                    className="text-[10px] uppercase font-black tracking-widest text-white/40 hover:text-white/80 transition-colors"
                  >
                    Cancel and go back
                  </button>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="mt-40 py-20 px-6 border-t border-white/5 bg-black/40 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center">
                <Zap size={16} className="text-white fill-white" />
              </div>
              <span className="font-black text-xl tracking-tighter text-white">LEADENRICH</span>
            </div>
            <p className="text-sm text-slate-300 max-w-xs leading-relaxed font-light">
              A simple tool to find emails and phone numbers from company websites —
              built for sales and marketing teams.
            </p>
          </div>
          <div className="space-y-4">
             <h4 className="text-xs font-black text-white uppercase tracking-widest">Quick links</h4>
             <ul className="space-y-2 text-sm text-slate-300 font-light">
               <li><a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How it works</a></li>
               <li><a href="#upload" className="hover:text-cyan-400 transition-colors">Try it free</a></li>
               <li><Link href="/docs" className="hover:text-cyan-400 transition-colors">Technical docs</Link></li>
             </ul>
          </div>
          <div className="space-y-4 text-right md:text-left">
             <p className="text-[10px] text-slate-400 uppercase tracking-[0.25em] font-black">Built by</p>
             <a href="https://apexaailabs.com" target="_blank" rel="noreferrer" className="text-sm text-white/80 hover:text-cyan-400 transition-colors">
               Apexa AI Labs
             </a>
             <p className="text-xs text-slate-400">apexaailabs.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
