import { NextRequest, NextResponse } from 'next/server';
import { triggerManualGeneration } from '@/lib/scheduler';
import { format } from 'date-fns';
import { isValidGenerateArticleKey, unauthorizedResponse } from '@/lib/auth/generateArticleAuth'

export async function POST(request: NextRequest) {
  try {
    if (!isValidGenerateArticleKey(request)) {
      console.warn('[API] Unauthorized attempt to generate article');
      return unauthorizedResponse()
    }

    const body = await request.json();
    const { date, translationsOnly, force } = body || {};
    const targetDate = date || format(new Date(), 'yyyy-MM-dd');
    triggerManualGeneration(targetDate, { translationsOnly: !!translationsOnly, force: !!force }).catch(err => {
      console.error('[API] Background generation failed', err);
    });
    return NextResponse.json({ message: 'Article generation started', date: targetDate }, { status: 202 });
  } catch (error) {
    console.error('[API] POST /api/generate-article error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
