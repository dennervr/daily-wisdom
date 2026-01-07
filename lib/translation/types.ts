import type { ArticleData } from '@/lib/types';
import type { LanguageCode } from '@/lib/constants';

export interface TranslationProvider {
  translate(article: ArticleData, targetLanguage: LanguageCode): Promise<ArticleData>;
  isAvailable(): boolean;
}
