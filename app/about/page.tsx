import About from "@/components/about"
import type { Metadata } from "next"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dailywisdom.app'

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Daily Wisdom - a minimalist publication delivering daily wisdom through AI-generated articles on Philosophy, Science, and History. Available in 12 languages worldwide.",
  keywords: [
    'about daily wisdom',
    'philosophy articles',
    'science education',
    'history learning',
    'AI-generated content',
    'multilingual education',
    'open source project'
  ],
  openGraph: {
    title: 'About Daily Wisdom',
    description: 'Learn about Daily Wisdom - a minimalist publication delivering daily wisdom through AI-generated articles on Philosophy, Science, and History.',
    type: 'website',
    url: `${baseUrl}/about`,
    siteName: 'Daily Wisdom',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'About Daily Wisdom',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Daily Wisdom',
    description: 'Learn about Daily Wisdom - a minimalist publication delivering daily wisdom through AI-generated articles on Philosophy, Science, and History.',
    images: [`${baseUrl}/og-image.png`],
  },
  alternates: {
    canonical: `${baseUrl}/about`,
  },
}

export default function AboutPage() {
  return <About />
}

