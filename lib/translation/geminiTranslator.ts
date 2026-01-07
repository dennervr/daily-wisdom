import { translateArticle } from '@/lib/geminiService';
import type { TranslationProvider } from './types';
import type { ArticleData } from '@/lib/types';
import type { LanguageCode } from '@/lib/constants';

export class GeminiTranslator implements TranslationProvider {
  isAvailable(): boolean {
    return !!process.env.GEMINI_API_KEY;
  }

  async translate(article: ArticleData, targetLanguage: LanguageCode): Promise<ArticleData> {
    return translateArticle(article, targetLanguage);
  }
}
