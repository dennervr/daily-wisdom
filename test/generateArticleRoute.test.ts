/// <reference types="vitest" />
import { vi, expect } from 'vitest'

describe('POST /api/generate-article', () => {
  afterEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
    process.env.GENERATE_ARTICLE_API_KEY = undefined
    process.env.NODE_ENV = 'test'
  })

  it('returns 401 when API key is set but not provided', async () => {
    process.env.GENERATE_ARTICLE_API_KEY = 'secret-1'
    const fakeReq: any = { headers: new Headers({}), json: async () => ({}) }

    const route = (await import('@/app/api/generate-article/route')).POST
    const res = await route(fakeReq as any)
    expect(res.status).toBe(401)
  })

  it('allows when no key set in non-production', async () => {
    process.env.GENERATE_ARTICLE_API_KEY = undefined
    process.env.NODE_ENV = 'development'

    const triggerMock = vi.fn()
    vi.mock('@/lib/scheduler', () => ({ triggerManualGeneration: triggerMock }))

    const fakeReq: any = { headers: new Headers({}), json: async () => ({ date: '2026-01-07' }) }

    const route = (await import('@/app/api/generate-article/route')).POST
    const res = await route(fakeReq as any)
    expect(res.status).toBe(202)
    expect(triggerMock).toHaveBeenCalled()
    expect(triggerMock.mock.calls[0][0]).toBe('2026-01-07')
  })

  it('accepts request with correct bearer token', async () => {
    process.env.GENERATE_ARTICLE_API_KEY = 'token-123'
    const triggerMock = vi.fn()
    vi.mock('@/lib/scheduler', () => ({ triggerManualGeneration: triggerMock }))

    const fakeReq: any = {
      headers: new Headers({ 'authorization': 'Bearer token-123' }),
      json: async () => ({})
    }

    const route = (await import('@/app/api/generate-article/route')).POST
    const res = await route(fakeReq as any)
    expect(res.status).toBe(202)
    expect(triggerMock).toHaveBeenCalled()
  })
})
