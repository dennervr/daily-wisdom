"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n"

interface ErrorStateProps {
  error: string
  onRetry: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const t = useTranslation()
  
  return (
    <div className="max-w-lg mx-auto mt-20 px-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t('error.title')}</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="text-xs font-mono mb-4">{error}</p>
          <Button size="sm" variant="outline" onClick={onRetry}>
            {t('error.retry')}
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  )
}
