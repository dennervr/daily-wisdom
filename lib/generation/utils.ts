import type { ModelResponse } from './types';

export const buildGenerationPrompt = (displayDate: string): string => {
  return `
    Context: You are the editor of "Daily Wisdom", a high-brow minimalist publication.
    
    Task:
    1. Select a timeless topic from Philosophy, Science, or History. 
       - It does NOT need to be related to today's date (${displayDate}).
       - It should be a "Hidden Gem" of knowledge—something profound but not cliché.
       - Examples: The Stoic concept of Sympatheia, The discovery of the Cosmic Microwave Background, The Library of Alexandria, Kintsugi.
    2. Write a 1,500+ word essay on this topic.
    3. The tone must be intellectual, calm, and inspiring.
    4. Connect the topic to personal development or the human condition.
    5. Use valid Markdown (H1 for title, H2 for sections).
    
    Constraint:
    - Base the article on real facts. Use Google Search to verify details.
  `;
};

export const extractTitle = (text: string | undefined, defaultTitle: string): string => {
  const titleMatch = text?.match(/^#\s+(.+)$/m);
  return titleMatch ? titleMatch[1] : defaultTitle;
};

export const extractSources = (response: ModelResponse): { title: string; uri: string }[] => {
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources: { title: string; uri: string }[] = [];
  groundingChunks.forEach((chunk) => {
    if (chunk.web?.uri) {
      sources.push({ title: chunk.web.title || 'Source', uri: chunk.web.uri });
    }
  });
  return sources.filter((v, i, a) => a.findIndex(v2 => v2.uri === v.uri) === i);
};
