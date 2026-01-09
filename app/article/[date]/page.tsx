import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArticle, getAllAvailableDates } from '@/lib/articleRepository'
import { SUPPORTED_LANGUAGES, type LanguageCode } from '@/lib/constants'
import Home from '@/components/home'
import { isValidDateFormat } from '@/lib/validation'
import { StructuredData, generateArticleStructuredData } from '@/components/structured-data'

type Props = {
  params: Promise<{ date: string }>
  searchParams: Promise<{ lang?: string }>
}

// Generate static params for all available articles
// Try to pre-generate pages at build time, but don't fail if DB is unavailable
export async function generateStaticParams() {
  try {
    const dates = await getAllAvailableDates()
    return dates.map((date) => ({
      date: date,
    }))
  } catch (error) {
    // Database may not be available during build (e.g., Railway CI/CD)
    // Return empty array - pages will be generated on-demand at runtime
    console.warn('⚠️  Could not fetch article dates during build (this is expected in CI/CD)')
    console.warn('✓  Article pages will be generated on-demand with ISR')
    return []
  }
}

// Allow dynamic params - enables ISR for paths not generated at build time
// This ensures SEO is maintained: bots get full HTML on first request
export const dynamicParams = true

// Generate metadata for SEO
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { date } = await params
  const { lang } = await searchParams
  
  // Validate and cast language
  const isValidLang = lang && lang in SUPPORTED_LANGUAGES
  const languageCode = isValidLang ? (lang as LanguageCode) : 'en'
  
  if (!isValidDateFormat(date)) {
    return {
      title: 'Invalid Date',
    }
  }

  const article = await getArticle(date, languageCode)
  
  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wisdom.denner.app.br'
  const canonicalUrl = `${baseUrl}/article/${date}`
  
  // Create hreflang alternates
  const languages = Object.entries(SUPPORTED_LANGUAGES).reduce((acc, [_, value]) => {
    acc[value.code] = `${baseUrl}/article/${date}?lang=${value.code}`
    return acc
  }, {} as Record<string, string>)

  return {
    title: article.title,
    description: article.content.substring(0, 160) + '...',
    keywords: ['philosophy', 'science', 'history', 'daily wisdom', article.title],
    authors: [{ name: 'Daily Wisdom AI', url: baseUrl }],
    openGraph: {
      title: article.title,
      description: article.content.substring(0, 160) + '...',
      type: 'article',
      url: canonicalUrl,
      siteName: 'Daily Wisdom',
      publishedTime: new Date(date).toISOString(),
      locale: languageCode === 'en' ? 'en_US' : languageCode,
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(article.title)}&date=${date}`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.content.substring(0, 160) + '...',
      images: [`${baseUrl}/api/og?title=${encodeURIComponent(article.title)}&date=${date}`],
    },
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
  }
}

export default async function ArticlePage({ params, searchParams }: Props) {
  const { date } = await params
  const { lang } = await searchParams
  
  // Validate and cast language
  const isValidLang = lang && lang in SUPPORTED_LANGUAGES
  const languageCode = isValidLang ? (lang as LanguageCode) : 'en'
  
  if (!isValidDateFormat(date)) {
    notFound()
  }

  const article = await getArticle(date, languageCode)
  
  if (!article) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wisdom.denner.app.br'
  const articleUrl = `${baseUrl}/article/${date}`
  const structuredData = generateArticleStructuredData(article, articleUrl)

  return (
    <>
      <StructuredData data={structuredData} />
      <Home initialArticle={article} />
    </>
  )
}

