import { NextRequest, NextResponse } from 'next/server';
import { getArticle } from '@/lib/articleRepository';
import { SUPPORTED_LANGUAGES } from '@/lib/constants';

type Params = Promise<{
  date: string;
}>;

export async function GET(request: NextRequest, { params }: { params: Params }) {
  const { date } = await params;
  try {
    const article = await getArticle(date, SUPPORTED_LANGUAGES['en'].code);
    if (!article) {
      // If missing for today, attempt generation and retry
      const today = new Date().toISOString().slice(0, 10);
      if (date === today) {
        try {
          // Lazy import to avoid circular deps
          const { ensureArticleForDate } = await import('@/lib/scheduler');
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
