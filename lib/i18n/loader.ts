/**
 * Translation Loader
 * 
 * Loads translation resources from JSON files.
 * Implements caching for performance.
 */

import type { LanguageCode } from '@/lib/constants'
import { I18N_CONFIG } from './config'

// Type for translation resources
export type TranslationResource = Record<string, any>

// Type for namespace - using the same type from config
export type I18nNamespace = typeof I18N_CONFIG.namespaces[number]

// Cache for loaded translations
const translationCache = new Map<string, TranslationResource>()

/**
 * Get cache key for locale and namespace
 */
function getCacheKey(locale: LanguageCode, namespace: I18nNamespace): string {
  return `${locale}:${namespace}`
}

/**
 * Load translations for a specific locale and namespace
 * Uses dynamic import for lazy loading
 */
export async function loadTranslations(
  locale: LanguageCode,
  namespace: I18nNamespace = I18N_CONFIG.defaultNamespace
): Promise<TranslationResource> {
  // Validate locale is supported to prevent path injection
  if (!I18N_CONFIG.supportedLocales.includes(locale)) {
    if (I18N_CONFIG.debug) {
      console.warn(`[i18n] Unsupported locale requested: ${locale}, using default`)
    }
    locale = I18N_CONFIG.defaultLocale
  }
  
  const cacheKey = getCacheKey(locale, namespace)
  
  // Check cache first
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!
  }
  
  try {
    // Dynamically import the JSON file (locale is now validated)
    const translations = await import(`@/locales/${locale}/${namespace}.json`)
    const resource = translations.default || translations
    
    // Cache the loaded translations
    translationCache.set(cacheKey, resource)
    
    if (I18N_CONFIG.debug) {
      console.log(`[i18n] Loaded translations for ${locale}:${namespace}`)
    }
    
    return resource
  } catch (error) {
    if (I18N_CONFIG.debug) {
      console.warn(`[i18n] Failed to load translations for ${locale}:${namespace}`, error)
    }
    
    // If fallback is enabled and we're not already loading the default locale
    if (I18N_CONFIG.fallbackToDefaultLocale && locale !== I18N_CONFIG.defaultLocale) {
      if (I18N_CONFIG.debug) {
        console.log(`[i18n] Falling back to default locale: ${I18N_CONFIG.defaultLocale}`)
      }
      return loadTranslations(I18N_CONFIG.defaultLocale, namespace)
    }
    
    // Return empty object as last resort
    return {}
  }
}

/**
 * Preload translations for a locale
 * Useful for server-side rendering or initial page load
 */
export async function preloadTranslations(locale: LanguageCode): Promise<void> {
  await Promise.all(
    I18N_CONFIG.namespaces.map(namespace => loadTranslations(locale, namespace))
  )
}

/**
 * Clear translation cache
 * Useful for hot reloading in development
 */
export function clearTranslationCache(): void {
  translationCache.clear()
  if (I18N_CONFIG.debug) {
    console.log('[i18n] Translation cache cleared')
  }
}
