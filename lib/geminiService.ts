import { GoogleGenAI } from "@google/genai";
import { saveArticle, getArticle } from '@/lib/articleRepository';
import type { ArticleData } from '@/lib/types';
import type { LanguageCode } from './constants';
import { SUPPORTED_LANGUAGES } from "./constants";
import { extractTitle } from './generation/utils';
import { retryWithBackoff } from './retryUtils';

const TRANSLATION_MODEL = process.env.GEMINI_TRANSLATION_MODEL || "gemini-2.5-flash";

class GeminiClient {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  }

  private buildTranslationPrompt(article: ArticleData, targetLanguageName: string): string {
    return `
    Translate the following Markdown article into ${targetLanguageName}.
    Keep the formatting, headers, and tone exactly the same.
    Do not output any explanation, just the translated markdown.
    
    Original Title: ${article.title}
    Original Content:
    ${article.content}
  `;
  }

  async translateArticle(article: ArticleData, targetLanguage: LanguageCode): Promise<ArticleData> {
    const targetLanguageName = SUPPORTED_LANGUAGES[targetLanguage].name;
    console.log(`[Gemini] Translating article to ${targetLanguageName} (${targetLanguage}) for date: ${article.date} using model: ${TRANSLATION_MODEL}`);

    const cached = await getArticle(article.date, targetLanguage);
    if (cached) {
      console.log('[Gemini] Translation found in cache');
      return cached;
    }

    const prompt = this.buildTranslationPrompt(article, targetLanguageName);

    const translatedArticle = await retryWithBackoff(
      async () => {
        const response = await this.ai.models.generateContent({
          model: TRANSLATION_MODEL,
          contents: prompt,
        });

        const translatedText = response.text;
        const title = extractTitle(translatedText, article.title);

        return {
          ...article,
          title,
          content: translatedText || '',
          language: targetLanguage,
          isTranslated: true,
        };
      },
      {
        maxAttempts: 5,
        baseDelayMs: 1000,
        onRetry: (attempt, error) => {
          console.warn(`[Gemini] Translation attempt ${attempt} failed for ${targetLanguage}:`, error.message);
        },
      }
    );

    console.log(`[Gemini] Translation completed for ${targetLanguage}`);
    await saveArticle(translatedArticle);
    return translatedArticle;
  }
}

const geminiClient = new GeminiClient();

export const translateArticle = (article: ArticleData, targetLanguage: LanguageCode): Promise<ArticleData> => {
  return geminiClient.translateArticle(article, targetLanguage);
};
