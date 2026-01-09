import About from "@/components/about"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About | Daily Wisdom",
  description: "Learn about Daily Wisdom - a minimalist publication delivering daily wisdom through AI-generated articles on Philosophy, Science, and History.",
}

export default function AboutPage() {
  return <About />
}
