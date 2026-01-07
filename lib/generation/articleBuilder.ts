import type { ArticleData } from '@/lib/types';
import type { ModelResponse } from './types';
import { SUPPORTED_LANGUAGES } from '@/lib/constants';
import { extractTitle, extractSources } from './utils';

export class ArticleBuilder {
  build(targetDate: string, response: ModelResponse): ArticleData {
    const text = response.text;
    const content = text || 'No content generated';
    
    if (!text) {
      console.warn('[ArticleBuilder] Response text is undefined, using fallback content');
    }

    const sources = extractSources(response);
    const title = extractTitle(text, 'Daily Wisdom');

    return {
      id: targetDate,
      title,
      content,
      date: targetDate,
      sources,
      language: SUPPORTED_LANGUAGES['en'].code,
    };
  }
}
