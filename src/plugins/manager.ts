import { spawn } from 'node:child_process'
import type { PluginHandshake, PluginSpec } from './types.js'

type PluginManagerDeps = {
  spawnPlugin?: (spec: PluginSpec) => Promise<PluginHandshake>
}

export class PluginManager {
  constructor(private readonly deps: PluginManagerDeps = {}) {}

  async load(specs: PluginSpec[]) {
    return Promise.all(specs.map((spec) => this.loadOne(spec)))
  }

  private async loadOne(spec: PluginSpec) {
    if (this.deps.spawnPlugin) {
      return this.deps.spawnPlugin(spec)
    }

    const child = spawn(spec.command, spec.args ?? [], { stdio: ['pipe', 'pipe', 'inherit'] })
    child.stdin.write(JSON.stringify({ type: 'handshake' }) + '\n')

    return await new Promise<PluginHandshake>((resolve, reject) => {
      child.stdout.once('data', (buffer) => {
        try {
          resolve(JSON.parse(buffer.toString()) as PluginHandshake)
        } catch (error) {
          reject(error)
        }
      })
      child.once('error', reject)
    })
  }
}