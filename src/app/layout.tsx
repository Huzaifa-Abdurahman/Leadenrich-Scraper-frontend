import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LeadEnrich — Find company contacts easily',
  description:
    'Enter company websites and get emails, phone numbers, and key contacts. Simple contact finder by Apexa AI Labs.',
  keywords: 'lead enrichment, find emails, company contacts, sales leads, contact finder',
  authors: [{ name: 'Apexa AI Labs' }],
  openGraph: {
    title: 'LeadEnrich — Find company contacts',
    description: 'Find emails and phone numbers from company websites in a few clicks.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
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
