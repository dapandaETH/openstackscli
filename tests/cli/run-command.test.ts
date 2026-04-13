import { describe, expect, it, vi } from 'vitest'
import { createRunAction } from '../../src/commands/run.js'

describe('createRunAction', () => {
  it('streams assistant output for a prompt', async () => {
    const writes: string[] = []
    const run = createRunAction({
      stdout: { write: (value: string) => void writes.push(value) }
    })

    await run('hello world')

    expect(writes.join('')).toContain('hello world')
  })
})