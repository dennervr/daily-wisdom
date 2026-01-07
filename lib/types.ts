export interface Source {
  title: string
  uri: string
}

import type { LanguageCode } from './constants'

export interface ArticleData {
  id: string
  date: string
  title: string
  content: string
  language: LanguageCode
  isTranslated: boolean
  sources: Source[]
}
