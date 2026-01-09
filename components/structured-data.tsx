import type { ArticleData } from '@/lib/types'

export function generateArticleStructuredData(article: ArticleData, url: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dailywisdom.app'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    datePublished: new Date(article.date).toISOString(),
    dateModified: new Date(article.date).toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Daily Wisdom',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Daily Wisdom',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    description: article.content.substring(0, 160),
    articleBody: article.content,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    inLanguage: article.language,
    ...(article.sources && article.sources.length > 0 && {
      citation: article.sources.map(source => ({
        '@type': 'CreativeWork',
        name: source.title,
        url: source.uri,
      })),
    }),
  }
}

export function generateOrganizationStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dailywisdom.app'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Daily Wisdom',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'A minimalist publication delivering daily wisdom through AI-generated articles on Philosophy, Science, and History.',
    sameAs: [
      'https://github.com/dennervr/daily-wisdom',
    ],
  }
}

export function generateWebSiteStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dailywisdom.app'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Daily Wisdom',
    url: baseUrl,
    description: 'A minimalist publication delivering daily wisdom through AI-generated articles on Philosophy, Science, and History.',
    inLanguage: ['en', 'es', 'fr', 'de', 'pt', 'it', 'nl', 'ru', 'ja', 'zh', 'ko', 'ar'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/article/{date}`,
      },
      'query-input': 'required name=date',
    },
  }
}

interface StructuredDataProps {
  data: object
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
