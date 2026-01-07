import type { ArticleData } from '@/lib/types';
import type { LanguageCode } from '@/lib/constants';
import { DeepLTranslator } from './deeplTranslator';
import { GeminiTranslator } from './geminiTranslator';
import { getArticle, saveArticle } from '@/lib/articleRepository';

const deeplTranslator = new DeepLTranslator();
const geminiTranslator = new GeminiTranslator();

export const translateArticle = async (article: ArticleData, targetLanguage: LanguageCode): Promise<ArticleData> => {
  console.log(`[TranslationService] Translating article to ${targetLanguage} for date: ${article.date}`);
  
  const cached = await getArticle(article.date, targetLanguage);
  if (cached) {
    console.log('[TranslationService] Translation found in cache');
    return cached;
  }

  let translatedArticle: ArticleData;

  if (deeplTranslator.isAvailable()) {
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
