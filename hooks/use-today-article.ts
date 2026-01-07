import type { ArticleData } from "@/lib/types"
import { SUPPORTED_LANGUAGES } from '@/lib/constants'
import { format } from "date-fns"
import { getArticle } from "@/lib/articleRepository"
import { useState } from "react"
import { useMemo } from "react"
import { useEffect } from "react"

export function useTodayArticle(): ArticleData | null{
  const [article, setArticle] = useState<ArticleData | null>(null)
  const today = useMemo(() => format(new Date(), "yyyy-MM-dd"), [])

  useEffect(() => {
    async function fetchArticle() {
      try {
        const enCode = SUPPORTED_LANGUAGES['en'].code
        const initialArticle = await getArticle(today, enCode) as ArticleData | null
        setArticle(initialArticle)
      } catch (error) {
        //TODO: Handle article error
        console.error('[Page] Failed to load initial article', error)
      }
    }

    fetchArticle()
  }, [])

  return article
}
