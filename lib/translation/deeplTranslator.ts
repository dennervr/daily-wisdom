import type { TranslationProvider, QuotaInfo } from './types';
import type { ArticleData } from '@/lib/types';
import type { LanguageCode } from '@/lib/constants';

const DEEPL_API_URL = process.env.DEEPL_API_URL || 'https://api-free.deepl.com/v2';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const QUOTA_WARNING_THRESHOLD = 0.9; // Warn when 90% of quota is used
const QUOTA_CACHE_DURATION_MS = 5 * 60 * 1000; // Cache quota for 5 minutes
const MIN_QUOTA_THRESHOLD = 1000; // Minimum characters required to consider DeepL available

const LANGUAGE_MAP: Partial<Record<LanguageCode, string>> = {
  'en': 'EN',
  'es': 'ES',
  'fr': 'FR',
  'de': 'DE',
  'pt': 'PT-BR',
  'it': 'IT',
  'nl': 'NL',
  'ru': 'RU',
  'ja': 'JA',
  'zh': 'ZH',
  'ko': 'KO',
};

interface DeepLUsageResponse {
  character_count: number;
  character_limit: number;
}

export class DeepLTranslator implements TranslationProvider {
  private apiKey: string | undefined;
  private cachedQuota: QuotaInfo | null = null;
  private quotaCacheTimestamp: number = 0;

  constructor() {
    this.apiKey = process.env.DEEPL_API_KEY;
  }

  isAvailable(): boolean {
    if (!this.apiKey) {
      return false;
    }

    // Check if we have cached quota information indicating exhaustion
    if (this.cachedQuota && this.isCacheValid()) {
      return this.cachedQuota.remaining >= MIN_QUOTA_THRESHOLD;
    }

    return true; // Assume available if no cache
  }

  /**
   * Check if the cached quota information is still valid
   */
  private isCacheValid(): boolean {
    return Date.now() - this.quotaCacheTimestamp < QUOTA_CACHE_DURATION_MS;
  }

  /**
   * Check DeepL API usage and quota limits
   * @param forceRefresh - Force refresh the cache
   * @returns Promise with quota information
   * @throws Error if API key is not configured or request fails
   */
  async checkQuota(forceRefresh = false): Promise<QuotaInfo> {
    if (!this.apiKey) {
      throw new Error('DeepL API key not configured');
    }

    // Return cached quota if available and valid
    if (!forceRefresh && this.cachedQuota && this.isCacheValid()) {
      return this.cachedQuota;
    }

    try {
      const response = await fetch(`${DEEPL_API_URL}/usage`, {
        method: 'GET',
        headers: {
          'Authorization': `DeepL-Auth-Key ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`DeepL API error: ${response.status} - ${errorText}`);
      }

      const data: DeepLUsageResponse = await response.json();
      
      const remaining = data.character_limit - data.character_count;
      const percentageUsed = (data.character_count / data.character_limit) * 100;

      const quotaInfo: QuotaInfo = {
        characterCount: data.character_count,
        characterLimit: data.character_limit,
        remaining,
        percentageUsed,
      };

      // Cache the quota information
      this.cachedQuota = quotaInfo;
      this.quotaCacheTimestamp = Date.now();

      return quotaInfo;
    } catch (error) {
      console.error('[DeepLTranslator] Failed to check quota:', error);
      throw error;
    }
  }

  async translate(article: ArticleData, targetLanguage: LanguageCode): Promise<ArticleData> {
    if (!this.apiKey) {
      throw new Error('DeepL API key not configured');
    }

    const deeplLanguageCode = LANGUAGE_MAP[targetLanguage];
    if (!deeplLanguageCode) {
      throw new Error(`Language ${targetLanguage} not supported by DeepL`);
    }

    console.log(`[DeepLTranslator] Translating article to ${targetLanguage} for date: ${article.date}`);

    // Check quota before translating
    const quotaInfo = await this.checkQuota();
    console.log(
      `[DeepLTranslator] Quota status: ${quotaInfo.characterCount.toLocaleString()}/${quotaInfo.characterLimit.toLocaleString()} ` +
      `(${quotaInfo.percentageUsed.toFixed(2)}% used, ${quotaInfo.remaining.toLocaleString()} remaining)`
    );

    // Estimate characters to translate (rough estimate)
    const estimatedChars = article.content.length + article.title.length;
    
    if (estimatedChars > quotaInfo.remaining) {
      throw new Error(
        `Insufficient DeepL quota: Need ~${estimatedChars} characters, but only ${quotaInfo.remaining} remaining`
      );
    }

    const translatedContent = await this.translateWithRetry(article.content, deeplLanguageCode);
    const translatedTitle = await this.translateWithRetry(article.title, deeplLanguageCode);

    const newArticle: ArticleData = {
      ...article,
      title: translatedTitle,
      content: translatedContent,
      language: targetLanguage,
    };

    console.log(`[DeepLTranslator] Translation completed for ${targetLanguage}`);
    return newArticle;
  }

  private async translateWithRetry(text: string, targetLang: string, retries = MAX_RETRIES): Promise<string> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await this.callDeepLApi(text, targetLang);
      } catch (error) {
        console.error(`[DeepLTranslator] Translation attempt ${attempt}/${retries} failed:`, error);
        if (attempt === retries) {
          throw error;
        }
        await this.delay(RETRY_DELAY_MS * attempt);
      }
    }
    throw new Error('Translation failed after all retries');
  }

  private async callDeepLApi(text: string, targetLang: string): Promise<string> {
    const response = await fetch(`${DEEPL_API_URL}/translate`, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLang,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`DeepL API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.translations?.[0]?.text || text;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
