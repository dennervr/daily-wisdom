import prisma from '../lib/prisma'
import { toArticleData, parseDateSafe } from './utils'
import type { ArticleData } from './types'
import { SUPPORTED_LANGUAGES, type LanguageCode } from './constants';

const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES['en'].code

/** Return UTC day range (start inclusive, end exclusive) for input date. */
function dayRangeForInput(dateInput: string | Date | undefined | null): { start: Date; end: Date } | null {
  if (!dateInput) return null

  let parsed: Date | null
  if (typeof dateInput === 'string') {
    // 'YYYY-MM-DD' treated as UTC midnight
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
      const [y, m, d] = dateInput.split('-').map(Number)
      parsed = new Date(Date.UTC(y, m - 1, d))
    } else {
      parsed = parseDateSafe(dateInput)
    }
  } else if (dateInput instanceof Date) {
    parsed = dateInput
  } else {
    parsed = null
  }

  if (!parsed) return null
  const startUtc = new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate()))
  const endUtc = new Date(startUtc)
  endUtc.setUTCDate(startUtc.getUTCDate() + 1)
  return { start: startUtc, end: endUtc }
}

/** Get article for a given day and language. */
export const getArticle = async (
  dateStr: string,
  language: LanguageCode = DEFAULT_LANGUAGE,
): Promise<ArticleData | null> => {
  const range = dayRangeForInput(dateStr)
  if (!range) return null

  const article = await prisma.article.findFirst({ where: { date: { gte: range.start, lt: range.end } } })
  if (!article) return null

  // If the requested language is English, return the base article
  if (language.toLowerCase() === DEFAULT_LANGUAGE.toLowerCase()) {
    return toArticleData(article, DEFAULT_LANGUAGE, false, article.date)
  }

  // Try to find a translation for the requested language
  const translation = await prisma.translation.findFirst({ where: { articleId: article.id, language } })
  if (!translation) return null

  // translation does not include sources, merge sources from parent
  return toArticleData({ ...translation, sources: article.sources }, language, true, article.date)
}

/** Save or update an article or its translation. */
export const saveArticle = async (article: ArticleData): Promise<void> => {
  const range = dayRangeForInput(article.date)
  if (!range) throw new Error('Invalid date')

  const sourcesJson = JSON.stringify(article.sources ?? [])

  // If not a translation, update or create the base article for the day
  if (!article.isTranslated) {
    const existing = await prisma.article.findFirst({ where: { date: { gte: range.start, lt: range.end } } })
    if (existing) {
      await prisma.article.update({ where: { id: existing.id }, data: { title: article.title, content: article.content, sources: sourcesJson, language: DEFAULT_LANGUAGE } })
    } else {
      await prisma.article.create({ data: { date: range.start, title: article.title, content: article.content, sources: sourcesJson, language: DEFAULT_LANGUAGE } })
    }
    return
  }

  // If a translation, make sure the parent article exists
  let parent = await prisma.article.findFirst({ where: { date: { gte: range.start, lt: range.end } } })
  if (!parent) {
    parent = await prisma.article.create({ data: { date: range.start, title: article.title, content: article.content, sources: sourcesJson, language: DEFAULT_LANGUAGE } })
    await prisma.translation.create({ data: { articleId: parent.id, language: article.language, title: article.title, content: article.content } })
    return
  }

  // Create or update the translation
  const existing = await prisma.translation.findFirst({ where: { articleId: parent.id, language: article.language } })
  if (existing) {
    await prisma.translation.update({ where: { id: existing.id }, data: { title: article.title, content: article.content } })
  } else {
    await prisma.translation.create({ data: { articleId: parent.id, language: article.language, title: article.title, content: article.content } })
  }
}

export const hasArticleForDate = async (dateStr: string): Promise<boolean> => {
  const range = dayRangeForInput(dateStr)
  if (!range) return false
  const count = await prisma.article.count({ where: { date: { gte: range.start, lt: range.end } } })
  return count > 0
}

export const hasTranslation = async (dateStr: string, language: LanguageCode): Promise<boolean> => {
  const range = dayRangeForInput(dateStr)
  if (!range) return false
  const article = await prisma.article.findFirst({ where: { date: { gte: range.start, lt: range.end } } })
  if (!article) return false
  const count = await prisma.translation.count({ where: { articleId: article.id, language } })
  return count > 0
}

export const resetDatabase = async (): Promise<void> => {
  await prisma.translation.deleteMany()
  await prisma.article.deleteMany()
}

export const close = async (): Promise<void> => {
  await prisma.$disconnect()
}

export const prismaClient = prisma
