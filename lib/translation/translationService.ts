import type { ArticleData } from '@/lib/types';
import type { LanguageCode } from '@/lib/constants';
import { DeepLTranslator } from './deeplTranslator';
import { GeminiTranslator } from './geminiTranslator';
import { getArticle, saveArticle } from '@/lib/articleRepository';

const deeplTranslator = new DeepLTranslator();
const geminiTranslator = new GeminiTranslator();

// Initialize and log translation providers on startup
let initialized = false;
let initializationPromise: Promise<void> | null = null;

/**
 * Initialize translation service and check provider availability
 * Should be called once at application startup
 */
export async function initializeTranslationService() {
  // If already initializing, wait for it to complete
  if (initializationPromise) {
    await initializationPromise;
    return;
  }
  
  if (initialized) return;

  // Create initialization promise to prevent race conditions
  initializationPromise = (async () => {
    initialized = true;

    console.log('='.repeat(70));
    console.log('[TranslationService] Initializing translation providers...');
    console.log('='.repeat(70));

    // Check DeepL and fetch quota to populate cache
    let deeplAvailable = false;
    if (deeplTranslator.checkQuota) {
      try {
        const quota = await deeplTranslator.checkQuota(true);
        deeplAvailable = quota.remaining >= 1000; // Check against threshold
        
        if (deeplAvailable) {
          console.log(
            `[TranslationService] DeepL: ✓ Available - ${quota.remaining.toLocaleString()}/${quota.characterLimit.toLocaleString()} characters remaining ` +
            `(${(100 - quota.percentageUsed).toFixed(2)}% free)`
          );
        } else {
          console.log(
            `[TranslationService] DeepL: ✗ Quota exhausted - ${quota.percentageUsed.toFixed(2)}% used ` +
            `(${quota.characterCount.toLocaleString()}/${quota.characterLimit.toLocaleString()} characters)`
          );
        }
      } catch (error) {
        console.error('[TranslationService] DeepL: ✗ Quota check failed -', error instanceof Error ? error.message : error);
      }
    } else {
      deeplAvailable = deeplTranslator.isAvailable();
      console.log(`[TranslationService] DeepL: ${deeplAvailable ? '✓ Available' : '✗ Not configured'}`);
    }

    // Check Gemini
    const geminiAvailable = geminiTranslator.isAvailable();
    const translationModel = process.env.GEMINI_TRANSLATION_MODEL || 'gemini-2.5-flash';
    console.log(`[TranslationService] Gemini: ${geminiAvailable ? `✓ Available (${translationModel})` : '✗ Not configured'}`);

    // Article generation model
    const generationModel = process.env.GEMINI_GENERATION_MODEL || 'gemini-2.5-flash';
    console.log(`[ArticleService] Gemini: ${geminiAvailable ? `✓ Available (${generationModel})` : '✗ Not configured'}`);

    // Summary
    if (!deeplAvailable && !geminiAvailable) {
      console.error('[TranslationService] ⚠️  WARNING: No translation providers available!');
    } else if (!deeplAvailable) {
      console.log(`[TranslationService] Using Gemini for translations (${translationModel})`);
    } else if (!geminiAvailable) {
      console.log('[TranslationService] Using DeepL for translations (no fallback available)');
    } else {
      console.log(`[TranslationService] Using DeepL with Gemini fallback (${translationModel})`);
    }
    
    console.log('='.repeat(70));
  })();

  await initializationPromise;
}

export const translateArticle = async (article: ArticleData, targetLanguage: LanguageCode): Promise<ArticleData> => {
  // Ensure translation service is initialized (happens once)
  await initializeTranslationService();

  console.log(`[TranslationService] Translating article to ${targetLanguage} for date: ${article.date}`);
  
  const cached = await getArticle(article.date, targetLanguage);
  if (cached) {
    console.log('[TranslationService] Translation found in cache');
    return cached;
  }

  let translatedArticle: ArticleData;

  // Check if DeepL is available (including quota check)
  const deeplAvailable = deeplTranslator.isAvailable();
  
  if (deeplAvailable) {
    try {
      console.log('[TranslationService] Attempting translation with DeepL');
      translatedArticle = await deeplTranslator.translate(article, targetLanguage);
      console.log('[TranslationService] DeepL translation successful');
    } catch (error) {
      console.error('[TranslationService] DeepL translation failed, falling back to Gemini:', error);
      if (!geminiTranslator.isAvailable()) {
        throw new Error('DeepL translation failed and Gemini fallback is not available');
      }
      translatedArticle = await geminiTranslator.translate(article, targetLanguage);
      console.log('[TranslationService] Gemini fallback translation successful');
    }
  } else {
    console.log('[TranslationService] DeepL not available, using Gemini');
    if (!geminiTranslator.isAvailable()) {
      throw new Error('No translation provider available');
    }
    translatedArticle = await geminiTranslator.translate(article, targetLanguage);
  }

  await saveArticle(translatedArticle);
  return translatedArticle;
};
