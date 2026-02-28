import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CapacitorListeners } from '@/components/capacitor-listeners'
import { PWAInstallBanner } from '@/components/pwa-install-banner'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Food Delivery App',
  description: 'A modern food delivery application',
  manifest: '/manifest.json',
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Food Delivery App',
    title: 'Food Delivery App',
    description: 'A modern food delivery application',
  },
  twitter: {
    card: 'summary',
    title: 'Food Delivery App',
    description: 'A modern food delivery application',
  },
  icons: {
    icon: [
      {
        url: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: [
      {
        url: '/apple-icon.png',
        type: 'image/png',
      },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased antigravity-scroll-lock">
        {children}
        <PWAInstallBanner />
        <Analytics />
        <CapacitorListeners />
      </body>
    </html>
  )
}
