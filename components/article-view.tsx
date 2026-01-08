"use client"

import ReactMarkdown from "react-markdown"
import { Search } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SUPPORTED_LANGUAGES } from "@/lib/constants"
import { useTranslation } from "@/lib/i18n"
import type { ArticleData } from "@/lib/types"

interface ArticleViewProps {
  data: ArticleData
}

export function ArticleView({ data }: ArticleViewProps) {
  const t = useTranslation()
  
  return (
    <article className="max-w-3xl mx-auto animate-in fade-in-0 duration-500">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="text-center pb-8">
          <p className="text-muted-foreground text-sm uppercase tracking-widest mb-2 font-medium">{data.date}</p>
          {data.language !== 'en' && (
            <Badge variant="secondary" className="w-fit mx-auto">
              {t('article.translatedInto', { language: SUPPORTED_LANGUAGES[data.language].name })}
            </Badge>
          )}
        </CardHeader>

        <CardContent className="prose prose-lg dark:prose-invert mx-auto font-serif leading-relaxed px-0">
          <ReactMarkdown
            components={{
              a: ({ children, href }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/80 underline decoration-muted-foreground/50 underline-offset-4 hover:decoration-foreground transition-colors"
                >
                  {children}
                </a>
              ),
              h1: ({ children }) => (
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 mt-4 text-foreground font-serif leading-tight text-balance">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl md:text-3xl font-semibold mt-10 mb-4 text-foreground font-serif">{children}</h2>
              ),
              p: ({ children }) => <p className="mb-6 text-lg md:text-xl font-light text-foreground/90">{children}</p>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground my-8">
                  {children}
                </blockquote>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-2 mb-6 text-foreground/90">{children}</ol>
              ),
              li: ({ children }) => <li className="text-lg">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
            }}
          >
            {data.content}
          </ReactMarkdown>
        </CardContent>

        <Separator className="my-8" />

        <CardFooter className="flex-col items-start px-0">
          <div className="flex items-center gap-2 mb-4 text-foreground font-medium">
            <Search className="w-5 h-5" />
            <span>{t('article.sources')}</span>
          </div>

          {data.sources.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 w-full">
              {data.sources.map((source, idx) => (
                <li key={idx} className="text-sm">
                  <a
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground/50 group-hover:bg-foreground flex-shrink-0" />
                    <span className="break-words">{source.title || source.uri}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground italic text-sm">{t('article.noSources')}</p>
          )}

          <div className="mt-12 flex flex-col items-center gap-2 text-center text-xs text-muted-foreground w-full">
            <p className="opacity-80 italic max-w-md">{t('article.aiWarning')}</p>
            <p className="uppercase tracking-widest mt-4">{t('footer.title')}</p>
            <a href={`mailto:${t('footer.contact')}`} className="hover:text-foreground transition-colors">
              {t('footer.contact')}
            </a>
          </div>
        </CardFooter>
      </Card>
    </article>
  )
}
