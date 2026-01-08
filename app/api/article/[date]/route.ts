import { NextRequest, NextResponse } from 'next/server';
import { getArticle } from '@/lib/articleRepository';
import { SUPPORTED_LANGUAGES } from '@/lib/constants';
import { isValidDateFormat } from '@/lib/validation';

type Params = Promise<{
  date: string;
}>;

export async function GET(request: NextRequest, { params }: { params: Params }) {
  const { date } = await params;
  
  // Validate date format
  if (!isValidDateFormat(date)) {
    return NextResponse.json(
      { 
        error: 'Invalid date format', 
        message: 'Date must be in YYYY-MM-DD format (e.g., 2026-01-08)' 
      }, 
      { status: 400 }
    );
  }
  
  try {
    const article = await getArticle(date, SUPPORTED_LANGUAGES['en'].code);
    if (!article) {
      // If missing for today, attempt generation and retry
      const today = new Date().toISOString().slice(0, 10);
      if (date === today) {
        try {
          // Lazy import to avoid circular deps
          const { ensureArticleForDate, isGeneratingArticle } = await import('@/lib/scheduler');
          
          // Check if generation is already in progress
          if (isGeneratingArticle(date)) {
            return NextResponse.json(
              { 
                status: 'generating', 
                message: 'Article is currently being generated. Please try again in a few moments.',
                retry_after: 30 
              }, 
              { 
                status: 202,
                headers: { 
                  'Cache-Control': 'no-store',
                  'Retry-After': '30'
                } 
              }
            );
          }
          
          // Start generation (async, will be caught by the in-memory lock)
          await ensureArticleForDate(date);
          const regenerated = await getArticle(date, SUPPORTED_LANGUAGES['en'].code);
          if (regenerated) {
            return NextResponse.json(regenerated, { status: 200, headers: { 'Cache-Control': 'no-store' } });
          }
          return NextResponse.json({ error: 'Article not found', message: `No article for ${date} after regeneration` }, { status: 500 });
        } catch (genErr) {
          console.error('[API] Regeneration attempt failed', genErr);
          return NextResponse.json({ error: 'Generation failed', message: 'Failed to generate today\'s article' }, { status: 500 });
        }
      }

      return NextResponse.json({ error: 'Article not found', message: `No article for ${date}` }, { status: 404 });
    }
    return NextResponse.json(article, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('[API] GET /api/article error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
