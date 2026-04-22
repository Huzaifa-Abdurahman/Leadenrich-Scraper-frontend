import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LeadEnrich — AI-Powered B2B Intelligence Platform',
  description:
    'Transform raw company data into deep B2B intelligence. Powered by Firecrawl neural extraction for smarter, faster sales enrichment.',
  keywords: 'lead enrichment, B2B intelligence, sales intelligence, web scraping, AI leads',
  authors: [{ name: 'LeadEnrich' }],
  openGraph: {
    title: 'LeadEnrich — AI B2B Intelligence',
    description: 'Enrich leads automatically with AI-powered insights.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <div className="mesh-bg" suppressHydrationWarning />
        <div className="mesh-dots" suppressHydrationWarning />
        <div style={{ position: 'relative', zIndex: 1 }} suppressHydrationWarning>
          {children}
        </div>
      </body>
    </html>
  );
}
