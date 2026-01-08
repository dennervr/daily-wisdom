"use client"

import React, { useState } from "react"
import useSWR from "swr"
import { format } from "date-fns"
import { Info } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { ArticleView } from "@/components/article-view"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { ArticleData } from "@/lib/types"
import { useLocale, useTranslation } from "@/lib/i18n"

const fetcher = async (url: string): Promise<ArticleData> => {
  const res = await fetch(url)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err?.error || err?.message || res.statusText)
  }
  return res.json()
}

const datesFetcher = async (url: string): Promise<{ dates: string[] }> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch dates')
  return res.json()
}

interface HomeProps {
  initialArticle?: ArticleData | null
}

export default function Home({ initialArticle = null }: HomeProps) {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"))
  const { locale, setLocale, languageConfig } = useLocale()
  const t = useTranslation()

  // Fetch available dates with caching
  const { data: datesData, error: datesError, isLoading: datesLoading } = useSWR<{ dates: string[] }>(
    '/api/available-dates',
    datesFetcher,
    { 
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 300000, // Revalidate every 5 minutes
      dedupingInterval: 60000, // Dedupe requests within 1 minute
    }
  )

  const availableDates = datesData?.dates ?? []
  const today = format(new Date(), "yyyy-MM-dd")
  const isToday = selectedDate === today

  const { data: article, error, isValidating, mutate } = useSWR<ArticleData>(
    () => `/api/article/${selectedDate}/${locale}`,
    fetcher,
    { fallbackData: initialArticle || undefined, revalidateOnFocus: false }
  )
  
  // Handler to update locale when language is changed
  const handleLanguageChange = (lang: typeof languageConfig) => {
    setLocale(lang.code)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <Navbar
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        language={languageConfig}
        onLanguageChange={handleLanguageChange}
        availableDates={availableDates}
        datesLoading={datesLoading}
        datesError={!!datesError}
      />

      {isToday && isValidating && (
        <div className="max-w-3xl mx-auto px-4 mt-6 pt-16">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              {t('datePicker.generating')}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <main className="flex-grow pt-24 px-4 relative">
        {isValidating && <LoadingState language={languageConfig} />}
        {error && !isValidating && (
          <ErrorState error={String(error.message)} onRetry={() => mutate()} />
        )}
        {article && !isValidating && !error && <ArticleView data={article} />}
      </main>
    </div>
  )
}
