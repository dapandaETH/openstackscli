import type { Command } from 'commander'
import { AgentEngine } from '../agent/engine.js'
import { ProviderRegistry } from '../providers/registry.js'

type RunDeps = {
  stdout?: { write(value: string): void }
}

export function createRunAction(deps: RunDeps = {}) {
  const stdout = deps.stdout ?? process.stdout
  const engine = new AgentEngine({ providerRegistry: new ProviderRegistry() })

  return async (prompt: string) => {
    await engine.run({ providerId: 'mock', prompt }, (chunk) => {
      stdout.write(chunk)
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