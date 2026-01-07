/**
 * i18n Configuration
 * 
 * Central configuration for internationalization and localization.
 * Defines supported locales, default locale, and fallback behavior.
 */

import type { LanguageCode } from '@/lib/constants'

export const I18N_CONFIG = {
  // Default locale - fallback when translation not found or locale not supported
  defaultLocale: (process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en') as LanguageCode,
  
  // List of supported locales
  supportedLocales: [
    'en', 'es', 'fr', 'de', 'pt', 'it', 
    'nl', 'ru', 'ja', 'zh', 'ko', 'ar'
  ] as LanguageCode[],
  
  // Namespaces for organizing translations
  namespaces: ['common'] as const,
  
  // Default namespace
  defaultNamespace: 'common' as const,
  
  // Enable fallback to default locale
  fallbackToDefaultLocale: true,
  
  // Enable debug logging (only in development)
  debug: process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_I18N_DEBUG === 'true',
} as const

export type I18nNamespace = typeof I18N_CONFIG.namespaces[number]

/**
 * Check if a locale is supported
 */
export function isSupportedLocale(locale: string): locale is LanguageCode {
  return I18N_CONFIG.supportedLocales.includes(locale as LanguageCode)
}

/**
 * Get the default locale
 */
export function getDefaultLocale(): LanguageCode {
  return I18N_CONFIG.defaultLocale
}

/**
 * Get all supported locales
 */
export function getSupportedLocales(): readonly LanguageCode[] {
  return I18N_CONFIG.supportedLocales
}
