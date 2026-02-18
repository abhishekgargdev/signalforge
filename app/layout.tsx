import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'SignalForge — Tech Intelligence & Career Signal Engine',
  description: 'AI-powered personal-brand, technology-intelligence, content-generation, company-engagement, and career-signal platform.',
  openGraph: {
    title: 'SignalForge — Tech Intelligence & Career Signal Engine',
    description: 'AI-powered personal-brand, technology-intelligence, content-generation, company-engagement, and career-signal platform.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SignalForge — Tech Intelligence & Career Signal Engine',
    description: 'AI-powered personal-brand, technology-intelligence, content-generation, company-engagement, and career-signal platform.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
