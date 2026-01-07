import cron from 'node-cron';
import { format } from 'date-fns';
import { generateArticle } from './generation/generationService';
import { translateArticle } from './translation/translationService';
import { getArticle, hasArticleForDate, hasTranslation } from './articleRepository';
import { SUPPORTED_LANGUAGES, type LanguageCode } from './constants';

let schedulerInitialized = false;

export const setupScheduler = () => {
  if (schedulerInitialized) {
    console.log('[Scheduler] Already initialized, skipping setup');
    return;
  }

  console.log('[Scheduler] Setting up daily article generation at 00:00');
  cron.schedule('0 0 * * *', async () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    console.log(`[Scheduler] Starting daily article generation for ${today}`);
    try {
      await generateDailyContentForDate(today);
      console.log(`[Scheduler] Daily generation completed successfully for ${today}`);
    } catch (error) {
      console.error('[Scheduler] Error during daily generation:', error);
    }
  }, {
    timezone: 'UTC',
  });
  schedulerInitialized = true;
  console.log('[Scheduler] Cron job registered successfully');
};

import { retryWithBackoff } from './retryUtils';

export const generateDailyContentForDate = async (date: string, options?: { translationsOnly?: boolean, force?: boolean }) => {
  console.log(`[Content Generator] Generating content for ${date}. options=${JSON.stringify(options)}`);
  let englishArticle: any = null;
  const alreadyExists = await hasArticleForDate(date);
  if (!alreadyExists || options?.force) {
    englishArticle = await generateArticle(date);
    console.log(`[Content Generator] English article generated: "${englishArticle.title}"`);
  } else {
    englishArticle = await getArticle(date, SUPPORTED_LANGUAGES['en'].code);
    if (!englishArticle) {
      englishArticle = await generateArticle(date);
      console.log(`[Content Generator] English article regenerated (inconsistency): "${englishArticle.title}"`);
    } else {
      console.log('[Content Generator] English article already exists and will not be regenerated.');
    }
  }

  if (options?.translationsOnly && !englishArticle) {
    console.warn('[Content Generator] translationsOnly set but no English article found for', date);
    return;
  }

  const languageCodes = Object.values(SUPPORTED_LANGUAGES).map(l => l.code)
  const translationPromises = languageCodes
    .filter(code => code !== SUPPORTED_LANGUAGES['en'].code)
    .map(async (language) => {
      try {
        if (!options?.force && await hasTranslation(date, language)) {
          console.log(`[Content Generator] Translation for ${language} already exists, skipping`);
          return;
        }
        console.log(`[Content Generator] Translating to ${language}...`);
        await translateArticle(englishArticle, language as LanguageCode);
        console.log(`[Content Generator] ${language} translation completed`);
      } catch (error) {
        console.error(`[Content Generator] Failed to translate to ${language}:`, error);
      }
    });
  await Promise.all(translationPromises);
  console.log(`[Content Generator] All translations completed for ${date}`);
};

// Concurrency guard for generation per date
const generationPromises = new Map<string, Promise<void>>();

export async function ensureArticleForDate(date: string, options?: { translationsOnly?: boolean, force?: boolean }) {
  if (generationPromises.has(date)) {
    console.log(`[Ensure] Waiting for existing generation for ${date}`);
    return generationPromises.get(date)!;
  }

  const p = (async () => {
    try {
      await retryWithBackoff(() => generateDailyContentForDate(date, options), {
        maxAttempts: 3,
        baseDelayMs: 2000,
        onRetry: (attempt, err) => console.log(`[Ensure] Retry ${attempt} for ${date} due to ${err.message}`),
      });
    } finally {
      generationPromises.delete(date);
    }
  })();

  generationPromises.set(date, p);
  return p;
}


export const triggerManualGeneration = async (date?: string, options?: { translationsOnly?: boolean, force?: boolean }) => {
  const targetDate = date || format(new Date(), 'yyyy-MM-dd');
  console.log(`[Manual Trigger] Generating content for ${targetDate} with options=${JSON.stringify(options)}`);
  await generateDailyContentForDate(targetDate, options);
};
