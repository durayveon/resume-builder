import { type Metadata, Viewport } from 'next';
import { Inter, Lexend } from 'next/font/google';
import clsx from 'clsx';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import '@/styles/globals.css';
import '@/styles/tailwind.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://smartresume.ai'),
  title: {
    template: '%s | SmartResume.ai',
    default: 'SmartResume.ai - AI-Powered Career Acceleration',
  },
  description:
    'AI-powered resume builder that creates ATS-optimized resumes and matches you with thousands of real job openings instantly.',
  keywords: [
    'resume builder',
    'AI resume',
    'job search',
    'career tools',
    'ATS resume',
    'professional resume',
  ],
  authors: [{ name: 'SmartResume Team' }],
  creator: 'SmartResume.ai',
  publisher: 'SmartResume.ai',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://smartresume.ai',
    siteName: 'SmartResume.ai',
    title: 'SmartResume.ai - AI-Powered Career Acceleration',
    description: 'Create ATS-optimized resumes and find your dream job with AI',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SmartResume.ai - AI-Powered Resume Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmartResume.ai - AI-Powered Career Acceleration',
    description: 'Create ATS-optimized resumes and find your dream job with AI',
    images: ['/twitter-image.jpg'],
    creator: '@smartresume',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'light dark',
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={clsx(
        'h-full scroll-smooth antialiased',
        inter.variable,
        lexend.variable,
        'bg-background text-foreground'
      )}
      suppressHydrationWarning
    >
      <body className="relative flex min-h-screen flex-col">
        <Providers>
          {children}
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
