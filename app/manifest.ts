import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Daily Wisdom - Philosophy, Science, and History',
    short_name: 'Daily Wisdom',
    description: 'A minimalist publication delivering daily wisdom through AI-generated articles on Philosophy, Science, and History.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['education', 'lifestyle', 'news'],
    lang: 'en',
    dir: 'ltr',
    orientation: 'portrait-primary',
  }
}
