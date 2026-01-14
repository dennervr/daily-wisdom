"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { BookOpen, Globe, Sun, Moon, Check, Heart, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LanguageConfigType, SUPPORTED_LANGUAGES } from "@/lib/constants"
import { useLocale, useTranslation } from "@/lib/i18n"

export function AboutNavbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { locale, setLocale, languageConfig } = useLocale()
  const t = useTranslation()

  useEffect(() => setMounted(true), [])

  const displayLanguage = mounted ? languageConfig.name : ""

  const handleLanguageChange = (lang: LanguageConfigType) => {
    setLocale(lang.code)
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Left: Back button */}
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline text-sm font-medium">{t('about.backButton')}</span>
        </Link>

        {/* Center: Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-foreground" />
          <span className="font-serif font-bold text-lg tracking-tight text-foreground hidden sm:inline">
            {t('navbar.title')}
          </span>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 rounded-full text-xs bg-transparent border-0 shadow-none sm:border sm:shadow-xs hover:bg-accent"
              >
                <Globe className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 w-5 h-5" />
                {mounted ? (
                  <span className="hidden sm:inline">{displayLanguage}</span>
                ) : (
                  <span className="hidden sm:inline w-20">&nbsp;</span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-64 overflow-y-auto">
              {Object.entries(SUPPORTED_LANGUAGES).map(([key, lang]) => (
                <DropdownMenuItem key={key} onClick={() => handleLanguageChange(lang)} className="justify-between">
                  {lang.name}
                  {languageConfig.code === lang.code && <Check className="w-4 h-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* GitHub Sponsors Button */}
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-0 shadow-none sm:border sm:shadow-xs hover:bg-accent"
            onClick={() => window.open('https://buy.stripe.com/00w3cxdx5ekPdsC1Pk6oo00', '_blank')}
            aria-label={t('navbar.sponsor')}
          >
            <Heart className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 w-5 h-5 text-red-500" />
            <span className="hidden sm:inline">{t('navbar.sponsor')}</span>
          </Button>

          {/* Theme Toggle */}
          {mounted && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
