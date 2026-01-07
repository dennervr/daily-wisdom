export interface RetryOptions {
  maxAttempts?: number;
  baseDelayMs?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

const defaultOptions: Required<RetryOptions> = {
  maxAttempts: 5,
  baseDelayMs: 1000,
  onRetry: () => {},
};

const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxAttempts, baseDelayMs, onRetry } = { ...defaultOptions, ...options };
  
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        throw lastError;
      }
      
      const delayMs = baseDelayMs * Math.pow(2, attempt - 1);
      onRetry(attempt, lastError);
      console.log(`[Retry] Attempt ${attempt}/${maxAttempts} failed. Retrying in ${delayMs}ms...`);
      
      await sleep(delayMs);
    }
  }
  
  throw lastError!;
}
