import { db } from './db'
import { day, articles } from './db/schema'
import { eq, and, count as drizzleCount } from 'drizzle-orm'
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

  // Find day
  const [dayResult] = await db.select().from(day).where(eq(day.date, date))
  if (!dayResult) return null

  // Find article with join
  const [result] = await db
    .select()
    .from(articles)
    .innerJoin(day, eq(articles.dayId, day.id))
    .where(and(
      eq(articles.dayId, dayResult.id),
      eq(articles.language, language)
    ))
  
  if (!result) return null

  // Merge article and day data
  const articleRow = { ...result.articles, day: result.day }
  return toArticleData(articleRow, language)
}

/** Save or update an article (base or translation). Uses Day + Article(dayId, language) model. */
export const saveArticle = async (article: ArticleData): Promise<void> => {
  const date = normalizeDate(article.date)
  if (!date) throw new Error('Invalid date')

  // Upsert Day record
  const [y, m, d] = date.split('-').map(Number)
  const [dayResult] = await db
    .insert(day)
    .values({ date, year: y, month: m, day: d })
    .onConflictDoUpdate({
      target: day.date,
      set: { date } // noop update
    })
    .returning()

  const sourcesVal = article.sources ?? []

  // Upsert Article for the given language
  await db
    .insert(articles)
    .values({
      dayId: dayResult.id,
      language: article.language,
      title: article.title,
      content: article.content,
      sources: sourcesVal,
    })
    .onConflictDoUpdate({
      target: [articles.dayId, articles.language],
      set: {
        title: article.title,
        content: article.content,
        sources: sourcesVal,
        updatedAt: new Date(),
      }
    })
}

export const hasArticleForDate = async (dateStr: string): Promise<boolean> => {
  const date = normalizeDate(dateStr)
  if (!date) return false
  
  const [dayResult] = await db.select().from(day).where(eq(day.date, date))
  if (!dayResult) return false
  
  const [result] = await db
    .select({ count: drizzleCount() })
    .from(articles)
    .where(and(
      eq(articles.dayId, dayResult.id),
      eq(articles.language, DEFAULT_LANGUAGE)
    ))
  
  return (result?.count ?? 0) > 0
}

export const hasTranslation = async (dateStr: string, language: LanguageCode): Promise<boolean> => {
  const date = normalizeDate(dateStr)
  if (!date) return false
  
  const [dayResult] = await db.select().from(day).where(eq(day.date, date))
  if (!dayResult) return false
  
  const [result] = await db
    .select({ count: drizzleCount() })
    .from(articles)
    .where(and(
      eq(articles.dayId, dayResult.id),
      eq(articles.language, language)
    ))
  
  return (result?.count ?? 0) > 0
}

export const resetDatabase = async (): Promise<void> => {
  await db.delete(articles)
  await db.delete(day)
}

export const close = async (): Promise<void> => {
  // Close the pg pool
  await db.$client.end()
}

export const dbClient = db
