import crypto from 'node:crypto'
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
  const sessionsDir = deps.sessionsDir ?? '.openstacks/sessions'
  const workspaceRoot = deps.workspaceRoot ?? process.cwd()
  const engine = new AgentEngine({ providerRegistry: new ProviderRegistry() })
  const sessionStore = new SessionStore(sessionsDir)

  return async (prompt: string) => {
    const result = await engine.run({ providerId: 'mock', prompt }, (chunk) => {
      stdout.write(chunk)
    })

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
  }
}

export function registerRunCommand(program: Command) {
  program
    .command('run')
    .description('Run one-shot prompt execution')
    .argument('<prompt>')
    .action(createRunAction())
}