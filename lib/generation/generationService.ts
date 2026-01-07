import type { ArticleData } from '@/lib/types';
import { GeminiGenerator } from './geminiGenerator';
import { ArticleOrchestrator } from './articleOrchestrator';

const geminiGenerator = new GeminiGenerator();
const orchestrator = new ArticleOrchestrator(geminiGenerator);

export const generateArticle = async (targetDate: string): Promise<ArticleData> => {
  return orchestrator.generateArticle(targetDate);
};
