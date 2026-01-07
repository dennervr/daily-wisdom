import Home from "@/components/home"
import { useTodayArticle } from "@/hooks/use-today-article"

export default async function HomePage() {
  const initialArticle = useTodayArticle()

  return <Home initialArticle={initialArticle} />
}
