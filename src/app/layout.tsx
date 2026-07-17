import type { Metadata } from 'next';
import { Sora, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const display = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700', '800'],
});

const body = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
});

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
    <html lang="en" className={`dark ${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="font-sans" suppressHydrationWarning>
        <div className="mesh-bg" suppressHydrationWarning />
        <div className="mesh-dots" suppressHydrationWarning />
        <div style={{ position: 'relative', zIndex: 1 }} suppressHydrationWarning>
          {children}
        </div>
      </body>
    </html>
  );
}
