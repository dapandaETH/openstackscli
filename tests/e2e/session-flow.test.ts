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

    const sessionContent = await fs.readFile(path.join(tempDir, files[0]), 'utf8')
    const session = JSON.parse(sessionContent)
    expect(session.title).toBe('create a plan')
    expect(session.workspaceRoot).toBe('/repo')
    expect(session.messages).toHaveLength(2)
    expect(writes.join('')).toContain('create a plan')
  })
})
