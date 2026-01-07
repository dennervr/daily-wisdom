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

export const toArticleData = (article: any, language: LanguageCode = SUPPORTED_LANGUAGES['en'].code, isTranslated = false, parentDate?: Date): ArticleData | null => {
  if (!article) return null
  const sources = article.sources ? JSON.parse(article.sources) : []
  const dateObj = article.date || parentDate
  return {
    id: String(article.id),
    date: dateObj instanceof Date ? dateObj.toISOString().slice(0, 10) : String(dateObj),
    title: article.title,
    content: article.content,
    language,
    isTranslated,
    sources,
  } as ArticleData
}
