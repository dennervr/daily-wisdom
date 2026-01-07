import { GoogleGenAI } from "@google/genai";
import type { ArticleGenerationProvider, ModelResponse } from './types';
import { format } from "date-fns";
import { buildGenerationPrompt } from './utils';
import { retryWithBackoff } from '@/lib/retryUtils';

const GENERATION_MODEL = process.env.GEMINI_GENERATION_MODEL || "gemini-2.5-flash";

export class GeminiGenerator implements ArticleGenerationProvider {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  }

  isAvailable(): boolean {
    return !!process.env.GEMINI_API_KEY;
  }

  async generate(targetDate: string): Promise<ModelResponse> {
    console.log(`[GeminiGenerator] Calling Gemini API (model: ${GENERATION_MODEL}) for date: ${targetDate}`);
    const seed = parseInt(targetDate.replace(/-/g, ''));
    const displayDate = format(new Date(targetDate), "MMMM do, yyyy");
    const prompt = buildGenerationPrompt(displayDate);

    return retryWithBackoff(
      async () => {
        const response = await this.ai.models.generateContent({
          model: GENERATION_MODEL,
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
            seed: seed,
            temperature: 0.7,
          },
        });

        console.log(`[GeminiGenerator] Gemini API call successful`);
        
        return {
          text: response.text,
          candidates: response.candidates,
        };
      },
      {
        maxAttempts: 5,
        baseDelayMs: 1000,
        onRetry: (attempt, error) => {
          console.warn(`[GeminiGenerator] Attempt ${attempt} failed:`, error.message);
        },
      }
    );
  }
}
