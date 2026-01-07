"use client"

/**
 * i18n Context Provider
 * 
 * Provides global state management for locale and translations.
 * Uses React Context to propagate locale changes to all components.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import type { LanguageCode } from '@/lib/constants'
import { SUPPORTED_LANGUAGES } from '@/lib/constants'
import { I18N_CONFIG } from './config'
import { loadTranslations } from './loader'
import { createTranslator } from './translate'
import type { InterpolationValues } from './interpolate'

// Type for translation resources
type TranslationResource = Record<string, any>

// Translation function type
export type TranslateFunction = (key: string, values?: InterpolationValues) => string

// Context value type
interface I18nContextValue {
  locale: LanguageCode
  setLocale: (locale: LanguageCode) => void
  t: TranslateFunction
  isLoading: boolean
  translations: TranslationResource
}

// Create context
const I18nContext = createContext<I18nContextValue | undefined>(undefined)

// Provider props
interface I18nProviderProps {
  children: React.ReactNode
  initialLocale?: LanguageCode
}

/**
 * i18n Provider Component
 * 
 * Wraps the application to provide translation functionality.
 * Manages locale state and loads translation resources.
 */
export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  // Detect browser language on client side
  const detectBrowserLanguage = (): LanguageCode => {
    if (typeof window === 'undefined') {
      return I18N_CONFIG.defaultLocale
    }
    
    // Check localStorage first for persisted preference
    const storedLocale = localStorage.getItem('daily-wisdom-locale')
    if (storedLocale && I18N_CONFIG.supportedLocales.includes(storedLocale as LanguageCode)) {
      return storedLocale as LanguageCode
    }
    
    // Try to detect from browser language
    const browserLang = navigator.language.split('-')[0].toLowerCase()
    if (I18N_CONFIG.supportedLocales.includes(browserLang as LanguageCode)) {
      return browserLang as LanguageCode
    }
    
    return I18N_CONFIG.defaultLocale
  }
  
  const [locale, setLocaleState] = useState<LanguageCode>(
    initialLocale || detectBrowserLanguage()
  )
  const [translations, setTranslations] = useState<TranslationResource>({})
  const [fallbackTranslations, setFallbackTranslations] = useState<TranslationResource>({})
  const [isLoading, setIsLoading] = useState(true)

  // Load translations when locale changes
  useEffect(() => {
    let isCancelled = false

    async function loadLocaleTranslations() {
      setIsLoading(true)
      
      try {
        // Load translations for current locale
        const localeTranslations = await loadTranslations(locale)
        
        // Load fallback translations if different from current locale
        let fallback = {}
        if (locale !== I18N_CONFIG.defaultLocale) {
          fallback = await loadTranslations(I18N_CONFIG.defaultLocale)
        }
        
        if (!isCancelled) {
          setTranslations(localeTranslations)
          setFallbackTranslations(fallback)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('[i18n] Failed to load translations', error)
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadLocaleTranslations()

    return () => {
      isCancelled = true
    }
  }, [locale])

  // Persist locale preference
  const setLocale = useCallback((newLocale: LanguageCode) => {
    if (newLocale === locale) return
    
    if (!I18N_CONFIG.supportedLocales.includes(newLocale)) {
      console.warn(`[i18n] Locale ${newLocale} is not supported`)
      return
    }
    
    setLocaleState(newLocale)
    
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('daily-wisdom-locale', newLocale)
    }
  }, [locale])

  // Create memoized translator function
  const t = useMemo(() => {
    return createTranslator(translations, fallbackTranslations)
  }, [translations, fallbackTranslations])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      isLoading,
      translations,
    }),
    [locale, setLocale, t, isLoading, translations]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

/**
 * Hook to use i18n context
 * 
 * @returns i18n context value with locale, setLocale, and t (translate function)
 * 
 * @example
 * const { locale, setLocale, t } = useI18n()
 * const title = t('navbar.title')
 * const greeting = t('greeting', { name: 'World' })
 */
export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext)
  
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  
  return context
}

/**
 * Hook to get just the translation function
 * Convenient shorthand for components that only need to translate
 */
export function useTranslation(): TranslateFunction {
  const { t } = useI18n()
  return t
}

/**
 * Hook to get locale info
 */
export function useLocale() {
  const { locale, setLocale } = useI18n()
  const languageConfig = SUPPORTED_LANGUAGES[locale]
  
  return {
    locale,
    setLocale,
    languageConfig,
  }
}
