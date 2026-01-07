# Internationalization (i18n) and Localization (l10n) Guide

This guide explains how to use the i18n/l10n system in the Daily Wisdom application.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Translation Keys](#translation-keys)
- [Using Translations](#using-translations)
- [Formatters](#formatters)
- [Adding New Languages](#adding-new-languages)
- [Best Practices](#best-practices)

## Overview

The Daily Wisdom i18n/l10n system provides:

- **Text Abstraction**: All UI text is stored in translation files, not hardcoded
- **Global State Management**: Locale state managed via React Context
- **Dynamic Interpolation**: Variables can be injected into translated strings
- **Locale-aware Formatting**: Dates, numbers, currencies formatted per locale
- **Robust Fallback**: Automatic fallback to default locale (English)
- **Lazy Loading**: Translation resources loaded on demand for performance

## Architecture

### Core Components

1. **Configuration** (`lib/i18n/config.ts`)
   - Defines supported locales and default locale
   - Configurable via environment variables

2. **Context Provider** (`lib/i18n/context.tsx`)
   - Manages global locale state
   - Provides translation function to all components

3. **Translation Loader** (`lib/i18n/loader.ts`)
   - Loads translation JSON files dynamically
   - Implements caching for performance

4. **Translation Function** (`lib/i18n/translate.ts`)
   - Resolves translation keys
   - Implements fallback logic

5. **Interpolation** (`lib/i18n/interpolate.ts`)
   - Safely injects variables into strings
   - Format: `"Hello, {name}!"`

6. **Formatters** (`lib/i18n/formatters.ts`)
   - Locale-aware date, number, currency formatting
   - Uses native Intl API

### Directory Structure

```
daily-wisdom/
├── lib/
│   └── i18n/           # i18n library code
│       ├── config.ts
│       ├── context.tsx
│       ├── formatters.ts
│       ├── index.ts
│       ├── interpolate.ts
│       ├── loader.ts
│       └── translate.ts
└── locales/            # Translation resources
    ├── en/
    │   └── common.json
    ├── es/
    │   └── common.json
    └── ...
```

## Getting Started

### 1. Environment Configuration

Add to `.env.local` (optional):

```bash
# Default locale (defaults to 'en' if not set)
NEXT_PUBLIC_DEFAULT_LOCALE=en

# Enable debug logging in development
NEXT_PUBLIC_I18N_DEBUG=true
```

### 2. Provider Setup

The `I18nProvider` is already integrated in `app/layout.tsx`:

```tsx
import { I18nProvider } from "@/lib/i18n"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
```

### 3. Using in Components

```tsx
import { useTranslation } from "@/lib/i18n"

function MyComponent() {
  const t = useTranslation()
  
  return (
    <div>
      <h1>{t('navbar.title')}</h1>
      <p>{t('loading.gathering')}</p>
    </div>
  )
}
```

## Translation Keys

### Naming Conventions

Translation keys follow a hierarchical dot notation pattern:

- **Format**: `namespace.category.key`
- **Semantic**: Keys describe purpose, not content
- **Consistent**: Use same pattern across all locales

### Key Structure

```
namespace.category.key
   │       │      │
   │       │      └─ Specific identifier
   │       └─ Functional grouping
   └─ Namespace (e.g., 'common')
```

### Examples

✅ **Good Keys** (semantic, descriptive)
```
navbar.title
navbar.selectDate
loading.gathering
error.notFound
article.translatedInto
```

❌ **Bad Keys** (content-based, not semantic)
```
dailyWisdom
chooseDate
gatheringWisdom
articleNotFoundError
translatedIntoSpanish
```

### Hierarchy Guidelines

- `app.*` - Application-level text (titles, descriptions)
- `navbar.*` - Navigation bar components
- `loading.*` - Loading states
- `error.*` - Error messages
- `article.*` - Article-related text
- `footer.*` - Footer content
- `date.*` - Date-related text
- `format.*` - Format patterns

## Using Translations

### Basic Translation

```tsx
const t = useTranslation()
const title = t('navbar.title')
// Returns: "Daily Wisdom" (in current locale)
```

### Interpolation

Use `{placeholder}` syntax for variables:

**Translation file:**
```json
{
  "article": {
    "translatedInto": "Translated into {language}"
  }
}
```

**Component:**
```tsx
const message = t('article.translatedInto', { language: 'Spanish' })
// Returns: "Translated into Spanish"
```

### Multiple Variables

```json
{
  "greeting": "Hello {name}, you have {count} messages"
}
```

```tsx
t('greeting', { name: 'John', count: 5 })
// Returns: "Hello John, you have 5 messages"
```

### Accessing Locale Information

```tsx
import { useLocale } from "@/lib/i18n"

function MyComponent() {
  const { locale, setLocale, languageConfig } = useLocale()
  
  console.log(locale)              // 'en'
  console.log(languageConfig.name) // 'English'
  
  return <button onClick={() => setLocale('es')}>
    Cambiar a Español
  </button>
}
```

### Full Context Access

```tsx
import { useI18n } from "@/lib/i18n"

function MyComponent() {
  const { locale, setLocale, t, isLoading } = useI18n()
  
  if (isLoading) {
    return <div>Loading translations...</div>
  }
  
  return <div>{t('app.title')}</div>
}
```

## Formatters

### Date Formatting

```tsx
import { formatDate } from "@/lib/i18n"
import { useLocale } from "@/lib/i18n"

function MyComponent() {
  const { locale } = useLocale()
  const date = new Date()
  
  // Short format
  const short = formatDate(date, locale, { dateStyle: 'short' })
  // en: "12/12/25"
  // es: "12/12/25"
  
  // Long format
  const long = formatDate(date, locale, { dateStyle: 'long' })
  // en: "December 12, 2025"
  // es: "12 de diciembre de 2025"
  
  // Custom format
  const custom = formatDate(date, locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  // en: "Friday, December 12, 2025"
  // es: "viernes, 12 de diciembre de 2025"
  
  return <div>{long}</div>
}
```

### Number Formatting

```tsx
import { formatNumber } from "@/lib/i18n"

const amount = 1234567.89

formatNumber(amount, 'en')  // "1,234,567.89"
formatNumber(amount, 'de')  // "1.234.567,89"
formatNumber(amount, 'fr')  // "1 234 567,89"
```

### Currency Formatting

```tsx
import { formatCurrency } from "@/lib/i18n"

formatCurrency(1234.56, 'USD', 'en')  // "$1,234.56"
formatCurrency(1234.56, 'EUR', 'de')  // "1.234,56 €"
formatCurrency(1234.56, 'JPY', 'ja')  // "¥1,235"
```

### Percentage Formatting

```tsx
import { formatPercent } from "@/lib/i18n"

formatPercent(0.75, 'en')   // "75%"
formatPercent(0.1234, 'en', { maximumFractionDigits: 1 })  // "12.3%"
```

### Relative Time

```tsx
import { formatRelativeTime } from "@/lib/i18n"

const yesterday = new Date(Date.now() - 86400000)
formatRelativeTime(yesterday, 'en')  // "yesterday"
formatRelativeTime(yesterday, 'es')  // "ayer"
```

### List Formatting

```tsx
import { formatList } from "@/lib/i18n"

const items = ['Apple', 'Banana', 'Orange']

formatList(items, 'en')  // "Apple, Banana, and Orange"
formatList(items, 'es')  // "Apple, Banana y Orange"
```

## Adding New Languages

### 1. Check if Language is Supported

The language must be listed in `lib/constants.ts` `SUPPORTED_LANGUAGES`:

```typescript
export const SUPPORTED_LANGUAGES = {
  en: { name: "English", countries: ["US", "GB"], code: "en" },
  es: { name: "Spanish", countries: ["ES", "MX"], code: "es" },
  // ... add your language here
}
```

### 2. Create Translation File

Create a new directory and file:

```
locales/
  └── [language-code]/
      └── common.json
```

Example for Italian (`it`):

```bash
mkdir -p locales/it
touch locales/it/common.json
```

### 3. Translate Content

Copy `locales/en/common.json` as a template and translate all values:

```json
{
  "app": {
    "title": "Saggezza Quotidiana",
    "description": "Una pubblicazione quotidiana..."
  },
  "navbar": {
    "title": "Saggezza Quotidiana",
    ...
  }
}
```

**Important**: 
- Keep the same JSON structure as English
- Preserve placeholders like `{language}`, `{name}`, etc.
- Translate only the values, not the keys

### 4. Update Configuration

Add the language to `lib/i18n/config.ts` if not already there:

```typescript
supportedLocales: [
  'en', 'es', 'fr', 'de', 'pt', 'it',  // add your code here
  'nl', 'ru', 'ja', 'zh', 'ko', 'ar'
] as LanguageCode[]
```

### 5. Test

The language will now be available in the language selector automatically!

## Best Practices

### 1. Always Use Translation Keys

❌ **Bad:**
```tsx
<h1>Daily Wisdom</h1>
```

✅ **Good:**
```tsx
const t = useTranslation()
<h1>{t('navbar.title')}</h1>
```

### 2. Use Semantic Keys

❌ **Bad:**
```tsx
t('dailyWisdomTitle')
t('textThatSaysHello')
```

✅ **Good:**
```tsx
t('navbar.title')
t('greeting.welcome')
```

### 3. Keep Interpolation Simple

❌ **Bad:**
```json
{
  "message": "User {user} has {count} items in cart valued at {total}"
}
```

✅ **Good:**
```json
{
  "message": "You have {count} items",
  "total": "Total: {amount}"
}
```

### 4. Use Formatters for Locale-specific Data

❌ **Bad:**
```tsx
<span>${price.toFixed(2)}</span>
```

✅ **Good:**
```tsx
import { formatCurrency } from "@/lib/i18n"
const { locale } = useLocale()
<span>{formatCurrency(price, 'USD', locale)}</span>
```

### 5. Don't Nest Translations

❌ **Bad:**
```tsx
t('hello') + ' ' + t('world')
```

✅ **Good:**
```tsx
t('greeting.helloWorld')
```

### 6. Provide Context in Keys

❌ **Bad:**
```json
{
  "save": "Save",
  "cancel": "Cancel"
}
```

✅ **Good:**
```json
{
  "button": {
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

### 7. Test All Languages

- Always test with at least 2-3 languages
- Check for text overflow in different locales
- Verify right-to-left (RTL) languages like Arabic

### 8. Keep Translation Files in Sync

- All language files should have the same structure
- Use English as the reference
- Don't remove keys from one locale without updating all

## Troubleshooting

### Translation Not Found

**Symptom**: Seeing the key instead of translated text

**Solution**: 
1. Check if key exists in `locales/[locale]/common.json`
2. Verify key spelling and hierarchy
3. Check browser console for debug messages (if `I18N_DEBUG=true`)

### Interpolation Not Working

**Symptom**: Seeing `{placeholder}` in output

**Solution**:
1. Pass values object as second argument: `t('key', { placeholder: 'value' })`
2. Check placeholder names match exactly

### Formatters Showing Wrong Locale

**Solution**:
1. Verify locale is set correctly: `const { locale } = useLocale()`
2. Check if locale is supported in `SUPPORTED_LANGUAGES`

### Build Errors

**Issue**: `useI18n must be used within an I18nProvider`

**Solution**: Ensure `I18nProvider` wraps your app in `layout.tsx`

## Migration from Old System

If migrating from the old `UI_TEXT` constant:

### Before:
```tsx
import { UI_TEXT } from "@/lib/constants"

function MyComponent() {
  return <h1>{UI_TEXT.loading}</h1>
}
```

### After:
```tsx
import { useTranslation } from "@/lib/i18n"

function MyComponent() {
  const t = useTranslation()
  return <h1>{t('loading.gathering')}</h1>
}
```

## Performance Considerations

- **Lazy Loading**: Translation files loaded on demand
- **Caching**: Loaded translations cached in memory
- **Minimal Re-renders**: Context optimized with `useMemo`
- **Code Splitting**: Each locale file is a separate chunk

## Resources

- [MDN Intl API Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [Next.js i18n Documentation](https://nextjs.org/docs/advanced-features/i18n-routing)
- [React Context Best Practices](https://react.dev/learn/passing-data-deeply-with-context)

## Support

For questions or issues with the i18n system:
1. Check this guide first
2. Review the code examples in `components/` directory
3. Look at existing translation files in `locales/`
4. Contact the development team
