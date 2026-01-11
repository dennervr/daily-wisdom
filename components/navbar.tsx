"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { BookOpen, Globe, Sun, Moon, Check, Heart, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DatePicker } from "@/components/date-picker"
import { LanguageConfigType, SUPPORTED_LANGUAGES } from "@/lib/constants"
import { useTranslation } from "@/lib/i18n"

interface NavbarProps {
  selectedDate: string
  onDateChange: (date: string) => void
  language: LanguageConfigType
  onLanguageChange: (lang: LanguageConfigType) => void
  availableDates: string[]
  datesLoading: boolean
  datesError: boolean
}

export function Navbar({ selectedDate, onDateChange, language, onLanguageChange, availableDates, datesLoading, datesError }: NavbarProps) {
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
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <BookOpen className="w-6 h-6 text-foreground hidden md:block" />
            <span className="font-serif font-bold text-lg tracking-tight text-foreground">{t('navbar.title')}</span>
          </Link>
          <Link href="/about">
            <Button
              variant="ghost"
              size="sm"
              className="flex gap-2 text-foreground hover:bg-accent"
            >
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">{t('navbar.about')}</span>
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Date Picker - Desktop */}
          <div className="hidden sm:block">
            <DatePicker
              selectedDate={selectedDate}
              onDateChange={onDateChange}
              availableDates={availableDates}
              isLoading={datesLoading}
              hasError={datesError}
              isMobile={false}
            />
          </div>

          {/* Date Picker - Mobile */}
          <div className="sm:hidden">
            <DatePicker
              selectedDate={selectedDate}
              onDateChange={onDateChange}
              availableDates={availableDates}
              isLoading={datesLoading}
              hasError={datesError}
              isMobile={true}
            />
          </div>

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
                <DropdownMenuItem key={key} onClick={() => onLanguageChange(lang)} className="justify-between">
                  {lang.name}
                  {language.code === lang.code && <Check className="w-4 h-4" />}
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
