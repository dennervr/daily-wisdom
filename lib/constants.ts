
export type LanguageConfig = {
  name: string
  countries: string[]
  code: string
}

export const SUPPORTED_LANGUAGES = {
  en: { name: "English", countries: ["US", "GB"], code: "en" },
  es: { name: "Spanish", countries: ["ES", "MX"], code: "es" },
  fr: { name: "French", countries: ["FR"], code: "fr" },
  de: { name: "German", countries: ["DE"], code: "de" },
  pt: { name: "Portuguese", countries: ["BR", "PT"], code: "pt" },
  it: { name: "Italian", countries: ["IT"], code: "it" },
  nl: { name: "Dutch", countries: ["NL"], code: "nl" },
  ru: { name: "Russian", countries: ["RU"], code: "ru" },
  ja: { name: "Japanese", countries: ["JP"], code: "ja" },
  zh: { name: "Chinese", countries: ["CN"], code: "zh" },
  ko: { name: "Korean", countries: ["KR"], code: "ko" },
  ar: { name: "Arabic", countries: ["SA"], code: "ar" },
} as const

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES
export type LanguageConfigType = (typeof SUPPORTED_LANGUAGES)[LanguageCode]

export const COUNTRY_TO_LANGUAGE: Record<string, LanguageCode> = {
  US: 'en',
  GB: 'en',
  ES: 'es',
  MX: 'es',
  FR: 'fr',
  DE: 'de',
  BR: 'pt',
  PT: 'pt',
  IT: 'it',
  NL: 'nl',
  RU: 'ru',
  JP: 'ja',
  CN: 'zh',
  KR: 'ko',
  SA: 'ar',
}

export const UI_TEXT = {
  loading: "Gathering wisdom...",
  translating: "Translating wisdom...",
  loadingSub: "Please wait while we prepare today's insights",
  error: "Unable to retrieve wisdom",
  refresh: "Try Again",
  sourceTitle: "Sources",
  aiWarning: "This content is AI-generated. Always verify important information.",
  footer: "Daily Wisdom",
  contact: "dennervrp@gmail.com",
}
