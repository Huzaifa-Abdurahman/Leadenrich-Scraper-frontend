'use client';

import { useState } from 'react';
import { Download, FileText, Share2, Loader2, CheckCircle2, Copy } from 'lucide-react';

interface ExportBarProps {
  jobId: string;
  leadCount: number;
}

type ExportState = 'idle' | 'loading' | 'done' | 'error';

export default function ExportBar({ jobId, leadCount }: ExportBarProps) {
  const [pdfState, setPdfState] = useState<ExportState>('idle');
  const [csvState, setCsvState] = useState<ExportState>('idle');
  const [copiedLink, setCopiedLink] = useState(false);

  const doExport = async (format: 'pdf' | 'csv') => {
    const setState = format === 'pdf' ? setPdfState : setCsvState;
    setState('loading');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const endpoint = format === 'pdf'
        ? `${apiUrl}/export/pdf/${jobId}`
        : `${apiUrl}/export/csv/${jobId}`;

      const res = await fetch(endpoint);
      if (!res.ok) throw new Error();

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = format === 'pdf'
        ? `LeadEnrich_Report_${jobId}.pdf`
        : `LeadEnrich_Leads_${jobId}.csv`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setState('done');
      setTimeout(() => setState('idle'), 3000);
    } catch {
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    }
  };

  const shareLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // fallback: do nothing
    }
  };

  return (
    <div
      className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      style={{ borderLeft: '3px solid var(--cyan)' }}
    >
      {/* Left */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-white">Export Intelligence Report</span>
          <span className="badge badge-cyan">{leadCount} leads</span>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Download a branded PDF or CSV for your CRM
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Share */}
        <button
          onClick={shareLink}
          className="btn-ghost text-sm flex items-center gap-1.5"
        >
          {copiedLink ? (
            <>
              <CheckCircle2 size={14} style={{ color: 'var(--emerald)' }} />
              <span style={{ color: 'var(--emerald)' }}>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy Link
            </>
          )}
        </button>

        {/* CSV */}
        <button
          onClick={() => doExport('csv')}
          disabled={csvState === 'loading'}
          className="btn-secondary text-sm py-2.5 px-5"
        >
          {csvState === 'loading' ? (
            <><Loader2 size={14} className="animate-spin" /> Exporting…</>
          ) : csvState === 'done' ? (
            <><CheckCircle2 size={14} style={{ color: 'var(--emerald)' }} /> Done!</>
          ) : (
            <><FileText size={14} /> CSV</>
          )}
        </button>

        {/* PDF */}
        <button
          onClick={() => doExport('pdf')}
          disabled={pdfState === 'loading'}
          className="btn-primary text-sm py-2.5 px-5"
        >
          {pdfState === 'loading' ? (
            <><Loader2 size={14} className="animate-spin" /> Generating PDF…</>
          ) : pdfState === 'done' ? (
            <><CheckCircle2 size={14} /> Downloaded!</>
          ) : (
            <><Download size={14} /> PDF Report</>
          )}
        </button>
      </div>
    </div>
  );
}
