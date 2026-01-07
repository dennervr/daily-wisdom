"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { format } from "date-fns"
import { BookOpen, Globe, Sun, Moon, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LanguageConfigType, SUPPORTED_LANGUAGES } from "@/lib/constants"
import { useTranslation } from "@/lib/i18n"

interface NavbarProps {
  selectedDate: string
  onDateChange: (date: string) => void
  language: LanguageConfigType
  onLanguageChange: (lang: LanguageConfigType) => void
}

export function Navbar({ selectedDate, onDateChange, language, onLanguageChange }: NavbarProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const t = useTranslation()

  useEffect(() => setMounted(true), [])

  // Prevent hydration mismatch by showing a placeholder until client-side hydration is complete
  const displayLanguage = mounted ? language.name : ""

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-foreground hidden md:block" />
          <span className="font-serif font-bold text-lg tracking-tight text-foreground">{t('navbar.title')}</span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Date Picker */}
          <input
            type="date"
            value={selectedDate}
            max={format(new Date(), "yyyy-MM-dd")}
            onChange={(e) => onDateChange(e.target.value)}
            aria-label={t('navbar.selectDate')}
            className="bg-transparent text-foreground text-sm border border-border rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-ring transition-colors"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 rounded-full text-xs bg-transparent">
                <Globe className="w-3.5 h-3.5" />
                {mounted ? (
                  <>
                    <span className="hidden sm:inline">{displayLanguage}</span>
                    <span className="sm:hidden">{displayLanguage.substring(0, 2)}</span>
                  </>
                ) : (
                  <span className="w-16 sm:w-20">&nbsp;</span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-64 overflow-y-auto">
              {Object.entries(SUPPORTED_LANGUAGES).map(([key, lang]) => (
                <DropdownMenuItem key={key} onClick={() => onLanguageChange(lang)} className="justify-between">
                  {lang.name}
                  {language.code === lang.code && <Check className="w-4 h-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          {mounted && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              aria-label={t('navbar.toggleTheme')}
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
