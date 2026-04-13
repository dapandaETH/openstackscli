import crypto from 'node:crypto'
import os from 'node:os'
import path from 'node:path'
import type { Command } from 'commander'
import { AgentEngine } from '../agent/engine.js'
import { ProviderRegistry } from '../providers/registry.js'
import { SessionStore } from '../sessions/store.js'

type RunDeps = {
  stdout?: { write(value: string): void }
  sessionsDir?: string
  workspaceRoot?: string
}

export function createRunAction(deps: RunDeps = {}) {
  const stdout = deps.stdout ?? process.stdout
  const workspaceRoot = deps.workspaceRoot ?? process.cwd()
  const sessionsDir = deps.sessionsDir
    ? path.isAbsolute(deps.sessionsDir)
      ? deps.sessionsDir
      : path.join(workspaceRoot, deps.sessionsDir)
    : path.join(os.homedir(), '.openstacks', 'sessions')
  const engine = new AgentEngine({ providerRegistry: new ProviderRegistry() })
  const sessionStore = new SessionStore(sessionsDir)

  return async (prompt: string) => {
    const result = await engine.run({ providerId: 'mock', prompt }, (chunk) => {
      stdout.write(chunk)
    })

    try {
      await sessionStore.save({
        id: crypto.randomUUID(),
        title: prompt.slice(0, 40),
        workspaceRoot,
        provider: 'mock',
        model: 'mock-model',
        messages: result.messages.filter(m => m.role !== 'system') as Array<{ role: 'user' | 'assistant' | 'tool'; content: string }>,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    } catch (err) {
      stderr.write(`[openstacks] warning: failed to save session: ${(err as Error).message}\n`)
    }
  }
}

const stderr = { write: (v: string) => process.stderr.write(v) }

export function registerRunCommand(program: Command) {
  program
    .command('run')
    .description('Run one-shot prompt execution')
    .argument('<prompt>')
    .action(createRunAction())
}