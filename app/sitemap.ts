import { MetadataRoute } from 'next'
import { getAllAvailableDates } from '@/lib/articleRepository'
import { SUPPORTED_LANGUAGES } from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dailywisdom.app'
  
  // Get all available article dates
  const dates = await getAllAvailableDates()
  
  // Static pages
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
  
  // Article pages
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
