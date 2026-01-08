"use client"

import { useState } from "react"
import { format, parse } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  selectedDate: string
  onDateChange: (date: string) => void
  availableDates: string[]
  isLoading?: boolean
  hasError?: boolean
  isMobile?: boolean
}

export function DatePicker({ 
  selectedDate, 
  onDateChange, 
  availableDates,
  isLoading = false,
  hasError = false,
  isMobile = false
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const t = useTranslation()
  
  // Convert string date to Date object
  const selectedDateObj = parse(selectedDate, "yyyy-MM-dd", new Date())
  
  // Convert available dates to Date objects for comparison
  const availableDateObjects = availableDates.map(dateStr => 
    parse(dateStr, "yyyy-MM-dd", new Date())
  )
  
  // Today's date for comparison
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Function to check if a date is disabled
  const isDateDisabled = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    const todayStr = format(today, "yyyy-MM-dd")
    
    // Always allow today (for lazy generation)
    if (dateStr === todayStr) {
      return false
    }
    
    // Disable dates in the future
    if (date > today) {
      return true
    }
    
    // If error or loading, disable all dates except today
    if (hasError || isLoading) {
      return true
    }
    
    // Check if date is in available dates
    return !availableDates.includes(dateStr)
  }
  
  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onDateChange(format(date, "yyyy-MM-dd"))
      setOpen(false)
    }
  }
  
  // Desktop: Button with Popover
  if (!isMobile) {
    return (
      <div className="relative">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal h-9 px-3 text-sm",
                !selectedDate && "text-muted-foreground"
              )}
              disabled={hasError}
              aria-label={t('navbar.selectDate')}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDateObj, "PP") : t('navbar.selectDate')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDateObj}
              onSelect={handleSelect}
              disabled={isDateDisabled}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        {hasError && (
          <p className="absolute top-full mt-1 text-xs text-destructive">
            {t('datePicker.error')}
          </p>
        )}
      </div>
    )
  }
  
  // Mobile: Icon button with Popover
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost"
          size="icon"
          disabled={hasError}
          aria-label={t('navbar.selectDate')}
        >
          <CalendarIcon className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          selected={selectedDateObj}
          onSelect={handleSelect}
          disabled={isDateDisabled}
          initialFocus
        />
        {hasError && (
          <div className="p-2 text-xs text-center text-destructive border-t">
            {t('datePicker.error')}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
