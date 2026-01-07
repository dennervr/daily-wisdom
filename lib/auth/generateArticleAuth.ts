import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'

export function getGenerateArticleApiKey() {
  return process.env.GENERATE_ARTICLE_API_KEY
}

export function extractApiKeyFromHeaders(headers: Headers | { get: (name: string) => string | null }) {
  const auth = headers.get('authorization') || ''
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    return auth.slice(7).trim()
  }
  const xKey = headers.get('x-api-key') || headers.get('X-Api-Key')
  if (xKey) return xKey.trim()
  return undefined
}

export function isValidGenerateArticleKey(request: NextRequest | { headers: Headers | { get: (name: string) => string | null } }) {
  const envKey = getGenerateArticleApiKey()
  const headers = (request as any).headers as Headers | { get: (name: string) => string | null }
  // If no key is configured:
  // - In production: refuse to allow generation
  // - In non-production: allow (convenience for local development and tests)
  if (!envKey) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[Auth] GENERATE_ARTICLE_API_KEY is not set in production; denying access')
      return false
    }
    console.warn('[Auth] GENERATE_ARTICLE_API_KEY is not set; allowing manual generation in non-production')
    return true
  }

  const provided = extractApiKeyFromHeaders(headers)
  if (!provided) return false
  try {
    const a = Buffer.from(provided)
    const b = Buffer.from(envKey)
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch (e) {
    return false
  }
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
