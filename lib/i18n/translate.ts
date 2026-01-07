/**
 * Translation Function
 * 
 * Core translation logic with key resolution, interpolation, and fallback.
 */

import type { LanguageCode } from '@/lib/constants'
import { I18N_CONFIG } from './config'
import { interpolate, type InterpolationValues } from './interpolate'

// Type for translation resources
type TranslationResource = Record<string, any>

/**
 * Get nested value from object using dot notation
 * 
 * @example
 * getNestedValue({ a: { b: { c: 'value' } } }, 'a.b.c')
 * // Returns: 'value'
 */
function getNestedValue(obj: Record<string, any>, path: string): string | undefined {
  const value = path.split('.').reduce<any>((current, key) => current?.[key], obj)
  return typeof value === 'string' ? value : undefined
}

/**
 * Translate a key to a string
 * 
 * @param translations - Translation resource object
 * @param key - Translation key in dot notation (e.g., 'navbar.title')
 * @param values - Optional values for interpolation
 * @param fallbackTranslations - Optional fallback translations (default locale)
 * @returns Translated string
 */
export function translate(
  translations: TranslationResource,
  key: string,
  values?: InterpolationValues,
  fallbackTranslations?: TranslationResource
): string {
  // Try to get the translation from primary locale
  let translation = getNestedValue(translations, key)
  
  // If not found, try fallback locale
  if (translation === undefined && fallbackTranslations) {
    translation = getNestedValue(fallbackTranslations, key)
    
    if (I18N_CONFIG.debug && translation !== undefined) {
      console.warn(`[i18n] Using fallback translation for key: ${key}`)
    }
  }
  
  // If still not found, return the key itself
  if (translation === undefined) {
    if (I18N_CONFIG.debug) {
      console.warn(`[i18n] Translation not found for key: ${key}`)
    }
    return key
  }
  
  // Interpolate values if provided
  if (values) {
    return interpolate(translation, values)
  }
  
  return translation
}

/**
 * Create a translation function bound to specific resources
 */
export function createTranslator(
  translations: TranslationResource,
  fallbackTranslations?: TranslationResource
) {
  return (key: string, values?: InterpolationValues): string => {
    return translate(translations, key, values, fallbackTranslations)
  }
}
