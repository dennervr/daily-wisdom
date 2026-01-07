import { NextResponse } from 'next/server';
import { setupScheduler, ensureArticleForDate } from '@/lib/scheduler';
import { format } from 'date-fns';

// Run setupScheduler once on module load (server start)
try {
  setupScheduler();
  // Optionally generate today's article in background unless explicitly disabled
  if (process.env.GENERATE_ON_STARTUP !== 'false' && process.env.NODE_ENV !== 'test') {
    const today = format(new Date(), 'yyyy-MM-dd');
    // Fire-and-forget, errors are logged inside ensureArticleForDate
    void ensureArticleForDate(today).catch((err) => console.error('[Startup] Failed to generate today article:', err));
  } else {
    console.log('[Startup] Skipping startup generation due to env configuration');
  }
} catch (error) {
  console.error('[Startup] Error while initializing scheduler/startup generation', error);
}

export async function GET() {
  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString(), message: 'Daily Wisdom API is running' });
}
