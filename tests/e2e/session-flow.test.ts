import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { createRunAction } from '../../src/commands/run.js'

describe('session flow', () => {
  it('persists a session after a one-shot run', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'openstacks-'))
    const writes: string[] = []
    const run = createRunAction({
      stdout: { write: (value: string) => void writes.push(value) },
      sessionsDir: tempDir,
      workspaceRoot: '/repo'
    })

    await run('create a plan')

    const files = await fs.readdir(tempDir)
    expect(files.length).toBe(1)
    expect(writes.join('')).toContain('create a plan')
  })
})
