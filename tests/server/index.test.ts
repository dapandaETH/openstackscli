import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('server', () => {
  let mockServer: { listen: Function; close: Function; on: Function }
  let mockPty: { onData: Function; onExit: Function; write: Function; kill: Function }

  beforeEach(() => {
    vi.resetModules()

    mockServer = {
      listen: vi.fn((port: number, host: string, cb: Function) => {
        if (cb) cb()
      }),
      close: vi.fn((cb: Function) => { if (cb) cb() }),
      on: vi.fn()
    }

    mockPty = {
      onData: vi.fn(),
      onExit: vi.fn(),
      write: vi.fn(),
      kill: vi.fn()
    }
  })

  it('startServer has correct signature', async () => {
    const module = await import('../../src/server/index.js')
    expect(typeof module.startServer).toBe('function')
  })

  it('startServer accepts port and host options', async () => {
    const module = await import('../../src/server/index.js')
    const sig = module.startServer.toString()
    expect(sig).toContain('port')
    expect(sig).toContain('host')
  })
})
