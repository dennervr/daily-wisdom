import Home from "@/components/home"
import { getArticle } from "@/lib/articleRepository"
import { SUPPORTED_LANGUAGES } from '@/lib/constants'
import { format } from "date-fns"

// Make this page dynamic (don't pre-render at build time)
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const today = format(new Date(), "yyyy-MM-dd")
  const enCode = SUPPORTED_LANGUAGES['en'].code
  const initialArticle = await getArticle(today, enCode)

  return <Home initialArticle={initialArticle} />
}
