import { NextRequest, NextResponse } from 'next/server';
import { getArticle } from '@/lib/articleRepository';
import type { LanguageCode } from '@/lib/constants';

type Params = Promise<{
  date: string;
  language: string;
}>;

export async function GET(request: NextRequest, { params }: { params: Params }) {
  const { date, language } = await params;
  try {
    let article = await getArticle(date, language as LanguageCode);
    if (!article) {
      const today = new Date().toISOString().slice(0, 10);
      if (date === today) {
        try {
          const { ensureArticleForDate } = await import('@/lib/scheduler');
          await ensureArticleForDate(date);
          article = await getArticle(date, language as LanguageCode);
          if (article) {
            return NextResponse.json(article, { status: 200, headers: { 'Cache-Control': 'no-store' } });
          }
          // If still missing for non-English, try translating from English
          if ((language as string).toLowerCase() !== 'en') {
            const { translateArticle } = await import('@/lib/translation/translationService');
            const enArticle = await getArticle(date, 'en' as LanguageCode);
            if (enArticle) {
              try {
                await translateArticle(enArticle, language as LanguageCode);
                const translated = await getArticle(date, language as LanguageCode);
                if (translated) {
                  return NextResponse.json(translated, { status: 200, headers: { 'Cache-Control': 'no-store' } });
                }
              } catch (transErr) {
                console.error('[API] Translation attempt failed', transErr);
                return NextResponse.json({ error: 'Translation failed', message: `Failed to translate article to ${language}` }, { status: 500 });
              }
            }
          }

          return NextResponse.json({ error: 'Article not found', message: `No article for ${date} in ${language} after regeneration` }, { status: 500 });
        } catch (genErr) {
          console.error('[API] Regeneration attempt failed', genErr);
          return NextResponse.json({ error: 'Generation failed', message: 'Failed to generate today\'s article' }, { status: 500 });
        }
      }

      return NextResponse.json({ error: 'Article not found', message: `No article for ${date} in ${language}` }, { status: 404 });
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
