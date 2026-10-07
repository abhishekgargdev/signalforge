import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PwaRegister } from '@/components/PwaRegister';
import { AppLoaders } from '@/components/AppLoaders';

const description =
  'AI-powered personal-brand, technology-intelligence, content-generation, company-engagement, and career-signal platform.';

export const metadata: Metadata = {
  applicationName: 'SignalForge',
  title: 'SignalForge — Tech Intelligence & Career Signal Engine',
  description,
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/images/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/images/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    title: 'SignalForge',
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    title: 'SignalForge — Tech Intelligence & Career Signal Engine',
    description,
    type: 'website',
    images: [{ url: '/images/icon-512.png', width: 512, height: 512, alt: 'SignalForge' }],
  },
  twitter: {
    card: 'summary',
    title: 'SignalForge — Tech Intelligence & Career Signal Engine',
    description,
    images: ['/images/icon-512.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#080c08',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <PwaRegister />
        <AppLoaders>{children}</AppLoaders>
      </body>
    </html>
  );
}
