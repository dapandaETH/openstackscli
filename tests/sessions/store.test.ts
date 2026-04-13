import { describe, expect, it } from 'vitest'
import { SessionStore } from '../../src/sessions/store.js'

describe('SessionStore', () => {
  it('round-trips a saved session', async () => {
    const store = new SessionStore('/tmp/openstacks-test-sessions')
    const session = await store.save({
      id: 'session-1',
      title: 'Test session',
      workspaceRoot: '/repo',
      provider: 'mock',
      model: 'mock-model',
      messages: [],
      createdAt: '2026-04-13T00:00:00.000Z',
      updatedAt: '2026-04-13T00:00:00.000Z'
    })

    const loaded = await store.load(session.id)
    expect(loaded?.title).toBe('Test session')
  })

  it('lists most recent sessions first', async () => {
    const store = new SessionStore('/tmp/openstacks-test-sessions-order')

    await store.save({
      id: 'older',
      title: 'Older',
      workspaceRoot: '/repo',
      provider: 'mock',
      model: 'mock-model',
      messages: [],
      createdAt: '2026-04-13T00:00:00.000Z',
      updatedAt: '2026-04-13T00:00:00.000Z'
    })

    await store.save({
      id: 'newer',
      title: 'Newer',
      workspaceRoot: '/repo',
      provider: 'mock',
      model: 'mock-model',
      messages: [],
      createdAt: '2026-04-13T00:00:01.000Z',
      updatedAt: '2026-04-13T00:00:01.000Z'
    })

    const sessions = await store.list()
    expect(sessions[0]?.id).toBe('newer')
  })
})
