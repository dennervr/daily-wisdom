/// <reference types="vitest" />
import { isValidGenerateArticleKey, extractApiKeyFromHeaders } from '@/lib/auth/generateArticleAuth'

describe('generateArticleAuth', () => {
  const OLD = process.env.GENERATE_ARTICLE_API_KEY
  beforeEach(() => {
    process.env.GENERATE_ARTICLE_API_KEY = 'test-key-123'
  })
  afterEach(() => {
    process.env.GENERATE_ARTICLE_API_KEY = OLD
  })

  it('extracts bearer token', () => {
    const headers = new Headers({ 'authorization': 'Bearer abc' })
    const key = extractApiKeyFromHeaders(headers as any)
    expect(key).toBe('abc')
  })

  it('extracts x-api-key', () => {
    const headers = new Headers({ 'x-api-key': 'xyz' })
    const key = extractApiKeyFromHeaders(headers as any)
    expect(key).toBe('xyz')
  })

  it('validates correct key', () => {
    const headers = new Headers({ 'authorization': 'Bearer test-key-123' })
    const req = { headers } as any
    expect(isValidGenerateArticleKey(req as any)).toBe(true)
  })

  it('rejects incorrect key', () => {
    const headers = new Headers({ 'authorization': 'Bearer wrong' })
    const req = { headers } as any
    expect(isValidGenerateArticleKey(req as any)).toBe(false)
  })
})
