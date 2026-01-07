import prisma from '../lib/prisma'
import { toArticleData, parseDateSafe } from './utils'
import type { ArticleData } from './types'
import { SUPPORTED_LANGUAGES, type LanguageCode } from './constants'

const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES['en'].code

/** Normalize date input to 'YYYY-MM-DD' string (UTC-based) */
function normalizeDate(dateInput: string | Date | undefined | null): string | null {
  if (!dateInput) return null

  let parsed: Date | null
  if (typeof dateInput === 'string') {
    // Already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
      return dateInput
    }
    parsed = parseDateSafe(dateInput)
  } else if (dateInput instanceof Date) {
    parsed = dateInput
  } else {
    parsed = null
  }

  if (!parsed) return null
  return parsed.toISOString().slice(0, 10)
}

/** Get article for a given day and language. */
export const getArticle = async (
  dateStr: string,
  language: LanguageCode = DEFAULT_LANGUAGE,
): Promise<ArticleData | null> => {
  const date = normalizeDate(dateStr)
  if (!date) return null

  const day = await prisma.day.findUnique({ where: { date } })
  if (!day) return null

  const articleRow = await prisma.article.findFirst({ 
    where: { dayId: day.id, language }, 
    include: { day: true } 
  })
  if (!articleRow) return null

  return toArticleData({ ...articleRow, day }, articleRow.language as LanguageCode)
}

/** Save or update an article (base or translation). Uses Day + Article(dayId, language) model. */
export const saveArticle = async (article: ArticleData): Promise<void> => {
  const date = normalizeDate(article.date)
  if (!date) throw new Error('Invalid date')

  // Upsert Day record
  const [y, m, d] = date.split('-').map(Number)
  const day = await prisma.day.upsert({
    where: { date },
    update: {},
    create: { date, year: y, month: m, day: d }
  })

  const sourcesVal = article.sources ?? []

  // Upsert Article for the given language
  await prisma.article.upsert({
    where: { dayId_language: { dayId: day.id, language: article.language } },
    update: {
      title: article.title,
      content: article.content,
      sources: sourcesVal as any,
    },
    create: {
      dayId: day.id,
      language: article.language,
      title: article.title,
      content: article.content,
      sources: sourcesVal as any,
    }
  })
}

export const hasArticleForDate = async (dateStr: string): Promise<boolean> => {
  const date = normalizeDate(dateStr)
  if (!date) return false
  const day = await prisma.day.findUnique({ where: { date } })
  if (!day) return false
  const count = await prisma.article.count({ where: { dayId: day.id, language: DEFAULT_LANGUAGE } })
  return count > 0
}

export const hasTranslation = async (dateStr: string, language: LanguageCode): Promise<boolean> => {
  const date = normalizeDate(dateStr)
  if (!date) return false
  const day = await prisma.day.findUnique({ where: { date } })
  if (!day) return false
  const count = await prisma.article.count({ where: { dayId: day.id, language } })
  return count > 0
}

export const resetDatabase = async (): Promise<void> => {
  await prisma.article.deleteMany()
  await prisma.day.deleteMany()
}

export const close = async (): Promise<void> => {
  await prisma.$disconnect()
}

export const prismaClient = prisma
