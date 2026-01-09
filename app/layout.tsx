import type React from "react"
import type { Metadata } from "next"
import { Crimson_Pro, Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/lib/i18n"
import { StructuredData, generateOrganizationStructuredData, generateWebSiteStructuredData } from "@/components/structured-data"
import "./globals.css"

const crimsonPro = Crimson_Pro({ subsets: ["latin"], variable: "--font-serif" })
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://wisdom.denner.app.br'),
  title: {
    default: "Daily Wisdom - Daily Articles on Philosophy, Science, and History",
    template: "%s | Daily Wisdom"
  },
  description: "In a world overflowing with information, Daily Wisdom offers a moment of clarity. Each day, we deliver an article exploring timeless topics in philosophy, science, and history.",
  keywords: [
    'philosophy',
    'science',
    'history',
    'daily wisdom',
    'educational content',
    'AI articles',
    'thought-provoking',
    'learning',
    'knowledge',
    'stoicism',
    'ancient philosophy',
    'modern science',
    'world history'
  ],
  authors: [{ name: 'Denner', url: 'https://github.com/dennervr' }],
  creator: 'Denner',
  publisher: 'Daily Wisdom',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Daily Wisdom',
    title: 'Daily Wisdom - Daily Articles on Philosophy, Science, and History',
    description: 'In a world overflowing with information, Daily Wisdom offers a moment of clarity. Explore timeless topics in philosophy, science, and history.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Daily Wisdom - Daily Articles on Philosophy, Science, and History',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Wisdom - Daily Articles on Philosophy, Science, and History',
    description: 'In a world overflowing with information, Daily Wisdom offers a moment of clarity. Explore timeless topics in philosophy, science, and history.',
    creator: '@dennervr',
    images: ['/og-image.png'],
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
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData data={generateOrganizationStructuredData()} />
        <StructuredData data={generateWebSiteStructuredData()} />
      </head>
      <body className={`${crimsonPro.variable} ${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <I18nProvider>
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
