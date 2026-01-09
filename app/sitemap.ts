import { MetadataRoute } from 'next'
import { getAllAvailableDates } from '@/lib/articleRepository'
import { SUPPORTED_LANGUAGES } from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dailywisdom.app'
  
  // Static pages (always available)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
  
  // Try to get article dates, but don't fail build if DB unavailable
  let dates: string[] = []
  try {
    dates = await getAllAvailableDates()
  } catch (error) {
    // Database may not be available during build (e.g., Railway CI/CD)
    // Return static pages only - sitemap will work fully at runtime
    console.warn('⚠️  Could not fetch article dates during build (this is expected in CI/CD)')
    console.warn('✓  Sitemap will include article pages at runtime')
    return staticPages
  }
  
  // Article pages (if we successfully got dates)
  const articlePages: MetadataRoute.Sitemap = dates.map(date => ({
    url: `${baseUrl}/article/${date}`,
    lastModified: new Date(date),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
    alternates: {
      languages: Object.entries(SUPPORTED_LANGUAGES).reduce((acc, [key, value]) => {
        acc[value.code] = `${baseUrl}/article/${date}?lang=${value.code}`
        return acc
      }, {} as Record<string, string>)
    }
  }))
  
  return [...staticPages, ...articlePages]
}
