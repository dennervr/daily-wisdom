import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { type LanguageConfigType } from "@/lib/constants"
import { useTranslation } from "@/lib/i18n"

interface LoadingStateProps {
  language: LanguageConfigType
}

export function LoadingState({ language }: LoadingStateProps) {
  const t = useTranslation()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => setMounted(true), [])
  
  // Show "gathering" for English (original article), "translating" for other languages
  // Wait for client-side hydration to prevent mismatch
  const text = mounted 
    ? (language.code === 'en' ? t('loading.gathering') : t('loading.translating'))
    : t('loading.gathering') // Default to 'gathering' during SSR

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 animate-in fade-in-0 duration-300">
      <div className="flex flex-col items-center mb-10">
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-12 w-3/4 mb-2" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </div>

      <p className="text-center text-muted-foreground mt-8 animate-pulse">{text}</p>
    </div>
  )
}
