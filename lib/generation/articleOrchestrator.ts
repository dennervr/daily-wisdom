import type { ArticleData } from '@/lib/types';
import type { ArticleGenerationProvider } from './types';
import { ArticleBuilder } from './articleBuilder';
import { getArticle, saveArticle } from '@/lib/articleRepository';
import { SUPPORTED_LANGUAGES } from '@/lib/constants';

export class ArticleOrchestrator {
  private provider: ArticleGenerationProvider;
  private builder: ArticleBuilder;

  constructor(provider: ArticleGenerationProvider) {
    this.provider = provider;
    this.builder = new ArticleBuilder();
  }

  async generateArticle(targetDate: string): Promise<ArticleData> {
    console.log(`[ArticleOrchestrator] Generating article for date: ${targetDate}`);

    const cached = await getArticle(targetDate, SUPPORTED_LANGUAGES['en'].code);
    if (cached) {
      console.log('[ArticleOrchestrator] Article found in cache');
      return cached;
    }

    if (!this.provider.isAvailable()) {
      throw new Error('No article generation provider available');
    }

    const rawResponse = await this.provider.generate(targetDate);
    const article = this.builder.build(targetDate, rawResponse);
    await saveArticle(article);
    
    console.log(`[ArticleOrchestrator] Article generated and saved successfully: "${article.title}"`);
    return article;
  }
}
