import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { SearchProvider } from '@/components/providers/SearchProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { siteConfig } from '@/config/site';
import '@/styles/globals.css';
import '@/styles/prism.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'React',
    'Responsive Design',
    'UI Library',
    'TypeScript',
    'Frontend',
    'Web Development',
    'Component Library',
    'Design System',
    'Mobile First',
    'Performance',
    'Accessibility'
  ],
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
  ],
  creator: siteConfig.author.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.author.twitter,
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
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://vercel.live" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: siteConfig.name,
              description: siteConfig.description,
              url: siteConfig.url,
              author: {
                '@type': 'Person',
                name: siteConfig.author.name,
                url: siteConfig.author.url,
              },
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Web Browser',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
            }),
          }}
        />
      </head>
      
      <body className="min-h-screen bg-white font-sans antialiased dark:bg-gray-950">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SearchProvider>
            <ToastProvider>
              <div className="relative flex min-h-screen flex-col">
                {children}
              </div>
            </ToastProvider>
          </SearchProvider>
        </ThemeProvider>
        
        {/* Analytics */}
        <Analytics />
        
        {/* Performance monitoring */}
        {process.env.NODE_ENV === 'production' && (
          <script
            defer
            src="https://vitals.vercel-insights.com/v1/vitals.js"
          />
        )}
      </body>
    </html>
  );
}
