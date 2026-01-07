/**
 * Locale-aware Formatters
 * 
 * Implements locale-specific formatting for dates, numbers, currencies, etc.
 * Uses native Intl API for robust localization support.
 */

import type { LanguageCode } from '@/lib/constants'
import { SUPPORTED_LANGUAGES } from '@/lib/constants'

/**
 * Get the best matching locale for Intl APIs
 * Falls back to 'en-US' if locale is not supported
 */
function getIntlLocale(locale: LanguageCode): string {
  const config = SUPPORTED_LANGUAGES[locale]
  if (!config) return 'en-US'
  
  // Use the first country code if available
  const country = config.countries[0]
  return country ? `${locale}-${country}` : locale
}

/**
 * Format a date according to locale
 * 
 * @param date - Date to format
 * @param locale - Target locale
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 * 
 * @example
 * formatDate(new Date(), 'en', { dateStyle: 'long' })
 * // Returns: "December 12, 2025"
 * 
 * formatDate(new Date(), 'es', { dateStyle: 'long' })
 * // Returns: "12 de diciembre de 2025"
 */
export function formatDate(
  date: Date | string | number,
  locale: LanguageCode,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  const intlLocale = getIntlLocale(locale)
  
  try {
    return new Intl.DateTimeFormat(intlLocale, options).format(dateObj)
  } catch (error) {
    console.warn('[i18n] Date formatting failed, using fallback', error)
    return new Intl.DateTimeFormat('en-US', options).format(dateObj)
  }
}

/**
 * Format a number according to locale
 * 
 * @param value - Number to format
 * @param locale - Target locale
 * @param options - Intl.NumberFormat options
 * @returns Formatted number string
 * 
 * @example
 * formatNumber(1234.56, 'en')
 * // Returns: "1,234.56"
 * 
 * formatNumber(1234.56, 'de')
 * // Returns: "1.234,56"
 */
export function formatNumber(
  value: number,
  locale: LanguageCode,
  options?: Intl.NumberFormatOptions
): string {
  const intlLocale = getIntlLocale(locale)
  
  try {
    return new Intl.NumberFormat(intlLocale, options).format(value)
  } catch (error) {
    console.warn('[i18n] Number formatting failed, using fallback', error)
    return new Intl.NumberFormat('en-US', options).format(value)
  }
}

/**
 * Format a currency value according to locale
 * 
 * @param value - Amount to format
 * @param currency - Currency code (e.g., 'USD', 'EUR')
 * @param locale - Target locale
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrency(1234.56, 'USD', 'en')
 * // Returns: "$1,234.56"
 * 
 * formatCurrency(1234.56, 'EUR', 'de')
 * // Returns: "1.234,56 €"
 */
export function formatCurrency(
  value: number,
  currency: string,
  locale: LanguageCode
): string {
  return formatNumber(value, locale, {
    style: 'currency',
    currency,
  })
}

/**
 * Format a percentage according to locale
 * 
 * @param value - Decimal value (e.g., 0.75 for 75%)
 * @param locale - Target locale
 * @param options - Additional number format options
 * @returns Formatted percentage string
 * 
 * @example
 * formatPercent(0.75, 'en')
 * // Returns: "75%"
 */
export function formatPercent(
  value: number,
  locale: LanguageCode,
  options?: Intl.NumberFormatOptions
): string {
  return formatNumber(value, locale, {
    style: 'percent',
    ...options,
  })
}

/**
 * Format a relative time (e.g., "2 days ago", "in 3 hours")
 * 
 * @param date - Date to compare
 * @param locale - Target locale
 * @param baseDate - Base date to compare against (defaults to now)
 * @returns Formatted relative time string
 * 
 * @example
 * formatRelativeTime(new Date(Date.now() - 86400000), 'en')
 * // Returns: "1 day ago"
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale: LanguageCode,
  baseDate: Date = new Date()
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  const intlLocale = getIntlLocale(locale)
  
  const diffMs = dateObj.getTime() - baseDate.getTime()
  const diffSeconds = Math.round(diffMs / 1000)
  const diffMinutes = Math.round(diffSeconds / 60)
  const diffHours = Math.round(diffMinutes / 60)
  const diffDays = Math.round(diffHours / 24)
  const diffMonths = Math.round(diffDays / 30)
  const diffYears = Math.round(diffDays / 365)
  
  try {
    const rtf = new Intl.RelativeTimeFormat(intlLocale, { numeric: 'auto' })
    
    if (Math.abs(diffYears) >= 1) {
      return rtf.format(diffYears, 'year')
    } else if (Math.abs(diffMonths) >= 1) {
      return rtf.format(diffMonths, 'month')
    } else if (Math.abs(diffDays) >= 1) {
      return rtf.format(diffDays, 'day')
    } else if (Math.abs(diffHours) >= 1) {
      return rtf.format(diffHours, 'hour')
    } else if (Math.abs(diffMinutes) >= 1) {
      return rtf.format(diffMinutes, 'minute')
    } else {
      return rtf.format(diffSeconds, 'second')
    }
  } catch (error) {
    console.warn('[i18n] Relative time formatting failed, using fallback', error)
    const rtf = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' })
    return rtf.format(diffDays, 'day')
  }
}

/**
 * Format a list according to locale
 * 
 * @param items - Array of strings to format
 * @param locale - Target locale
 * @param type - Type of list formatting
 * @returns Formatted list string
 * 
 * @example
 * formatList(['Apple', 'Banana', 'Orange'], 'en')
 * // Returns: "Apple, Banana, and Orange"
 * 
 * formatList(['Apple', 'Banana', 'Orange'], 'es')
 * // Returns: "Apple, Banana y Orange"
 */
export function formatList(
  items: string[],
  locale: LanguageCode,
  type: 'conjunction' | 'disjunction' = 'conjunction'
): string {
  const intlLocale = getIntlLocale(locale)
  
  try {
    return new Intl.ListFormat(intlLocale, { type }).format(items)
  } catch (error) {
    console.warn('[i18n] List formatting failed, using fallback', error)
    return new Intl.ListFormat('en-US', { type }).format(items)
  }
}

/**
 * Get locale-specific decimal separator
 */
export function getDecimalSeparator(locale: LanguageCode): string {
  const formatted = formatNumber(1.1, locale)
  return formatted.charAt(1)
}

/**
 * Get locale-specific thousand separator
 */
export function getThousandSeparator(locale: LanguageCode): string {
  const formatted = formatNumber(1000, locale)
  return formatted.charAt(1)
}
