import { isValid, parse } from 'date-fns';
import { SUPPORTED_LANGUAGES, type LanguageCode } from './constants';

/**
 * Validates a date string in YYYY-MM-DD format
 * @param dateStr - The date string to validate
 * @returns true if valid, false otherwise
 */
export function isValidDateFormat(dateStr: string): boolean {
  if (!dateStr || typeof dateStr !== 'string') {
    return false;
  }
  
  // Check format YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    return false;
  }
  
  // Check if it's a valid date
  const parsedDate = parse(dateStr, 'yyyy-MM-dd', new Date());
  return isValid(parsedDate);
}

/**
 * Validates a language code against supported languages
 * @param language - The language code to validate
 * @returns true if valid, false otherwise
 */
export function isValidLanguage(language: string): language is LanguageCode {
  if (!language || typeof language !== 'string') {
    return false;
  }
  
  const supportedCodes = Object.values(SUPPORTED_LANGUAGES).map(l => l.code);
  return supportedCodes.includes(language as LanguageCode);
}

/**
 * Validates required environment variables at startup
 * @throws Error if required environment variables are missing or invalid
 */
export function validateEnvironmentVariables(): void {
  const errors: string[] = [];
  
  // Check DATABASE_URL
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim().length === 0) {
    errors.push('DATABASE_URL is required');
  }
  
  // Check GEMINI_API_KEY
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.trim().length === 0) {
    errors.push('GEMINI_API_KEY is required');
  } else if (process.env.GEMINI_API_KEY.trim().length < 10) {
    errors.push('GEMINI_API_KEY appears to be invalid (too short)');
  }
  
  // Warn about optional but recommended variables
  if (!process.env.DEEPL_API_KEY || process.env.DEEPL_API_KEY.trim().length === 0) {
    console.warn('[Config] DEEPL_API_KEY not set - will use Gemini for all translations');
  }
  
  if (errors.length > 0) {
    throw new Error(`Environment variable validation failed:\n${errors.map(e => `  - ${e}`).join('\n')}`);
  }
  
  console.log('[Config] ✅ All required environment variables validated');
}
