import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { parseISO, isValid } from 'date-fns'
import type { ArticleData } from './types'
import { SUPPORTED_LANGUAGES, type LanguageCode } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseDateSafe(dateStr: string) {
  const date = parseISO(dateStr)
  return isValid(date as Date) ? (date as Date) : null
}

export const toArticleData = (article: any, language: LanguageCode = SUPPORTED_LANGUAGES['en'].code): ArticleData | null => {
  if (!article) return null

  const sources = Array.isArray(article.sources) ? article.sources : []
  if (!article.day || !article.day.date) return null

  return {
    id: String(article.id),
    date: String(article.day.date),
    title: article.title,
    content: article.content,
    language,
    sources,
  } as ArticleData
}
