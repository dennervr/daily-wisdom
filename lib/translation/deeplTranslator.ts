import type { TranslationProvider } from './types';
import type { ArticleData } from '@/lib/types';
import type { LanguageCode } from '@/lib/constants';

const DEEPL_API_URL = process.env.DEEPL_API_URL || 'https://api-free.deepl.com/v2';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

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

export class DeepLTranslator implements TranslationProvider {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.DEEPL_API_KEY;
  }

  isAvailable(): boolean {
    return !!this.apiKey;
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
