import { pgTable, serial, text, integer, jsonb, timestamp, unique } from 'drizzle-orm/pg-core'
import type { Source } from '../types'

export const day = pgTable('day', {
  id: serial('id').primaryKey(),
  date: text('date').notNull().unique(),
  year: integer('year').notNull(),
  month: integer('month').notNull(),
  day: integer('day').notNull(),
})

export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  dayId: integer('dayId')
    .notNull()
    .references(() => day.id, { onDelete: 'cascade' }),
  language: text('language').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  sources: jsonb('sources').$type<Source[]>().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
}, (table) => ({
  uniqueDayLanguage: unique().on(table.dayId, table.language),
}))
