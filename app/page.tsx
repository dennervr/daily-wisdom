import { format } from "date-fns"
import { getArticle } from "@/lib/articleRepository"
import Home from "@/components/home"
import type { ArticleData } from "@/lib/types"
import { SUPPORTED_LANGUAGES } from '@/lib/constants'

export default async function HomePage() {
  const today = format(new Date(), "yyyy-MM-dd")
  let initialArticle: ArticleData | null = null
  try {
    initialArticle = (await getArticle(today, SUPPORTED_LANGUAGES['en'].code)) as ArticleData | null
  } catch (error) {
    // server side error ignored, client will show fallback
    console.error('[Page] Failed to load initial article', error)
  }
  return <Home initialArticle={initialArticle} />
}
