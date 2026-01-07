export interface ModelResponse {
  text?: string;
  candidates?: Array<{
    groundingMetadata?: {
      groundingChunks?: Array<{
        web?: {
          uri?: string;
          title?: string;
        };
      }>;
    };
  }>;
}

export interface ArticleGenerationProvider {
  generate(targetDate: string): Promise<ModelResponse>;
  isAvailable(): boolean;
}
