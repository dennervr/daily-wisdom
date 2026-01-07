/**
 * i18n/l10n Library
 * 
 * Main entry point for internationalization and localization functionality.
 * 
 * Key Features:
 * - Text abstraction through translation keys
 * - Global locale state management via Context
 * - Dynamic variable interpolation
 * - Locale-aware formatters for dates, numbers, currencies
 * - Robust fallback to default locale
 * - Lazy loading of translation resources
 * 
 * @example
 * // In your app layout:
 * import { I18nProvider } from '@/lib/i18n'
 * 
 * <I18nProvider initialLocale="en">
 *   <YourApp />
 * </I18nProvider>
 * 
 * @example
 * // In your components:
 * import { useI18n } from '@/lib/i18n'
 * 
 * function MyComponent() {
 *   const { t, locale } = useI18n()
 *   return <h1>{t('navbar.title')}</h1>
 * }
 */

// Config
export { I18N_CONFIG, isSupportedLocale, getDefaultLocale, getSupportedLocales } from './config'
export type { I18nNamespace } from './config'

// Context and hooks
export { I18nProvider, useI18n, useTranslation, useLocale } from './context'
export type { TranslateFunction } from './context'

// Translation
export { translate, createTranslator } from './translate'

// Interpolation
export { interpolate, hasInterpolation, extractPlaceholders } from './interpolate'
export type { InterpolationValues } from './interpolate'

// Formatters
export {
  formatDate,
  formatNumber,
  formatCurrency,
  formatPercent,
  formatRelativeTime,
  formatList,
  getDecimalSeparator,
  getThousandSeparator,
} from './formatters'

// Loader
export { loadTranslations, preloadTranslations, clearTranslationCache } from './loader'
export type { TranslationResource } from './loader'
