import type { ArticleData } from '@/lib/types';
import type { LanguageCode } from '@/lib/constants';

export interface QuotaInfo {
  characterCount: number;
  characterLimit: number;
  remaining: number;
  percentageUsed: number;
}

export interface TranslationProvider {
  translate(article: ArticleData, targetLanguage: LanguageCode): Promise<ArticleData>;
  isAvailable(): boolean;
  checkQuota?(forceRefresh?: boolean): Promise<QuotaInfo>;
}
