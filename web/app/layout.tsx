import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  axes: ['opsz'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://saahil.io'),
  title: {
    default: 'Saahil Parikh',
    template: '%s — Saahil Parikh',
  },
  description: 'Saahil Parikh — engineer. Selected work and projects.',
  openGraph: {
    title: 'Saahil Parikh',
    description: 'Saahil Parikh — engineer. Selected work and projects.',
    url: 'https://saahil.io',
    siteName: 'Saahil Parikh',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Saahil Parikh',
    description: 'Saahil Parikh — engineer. Selected work and projects.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  );
}
