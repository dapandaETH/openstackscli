import { spawn } from 'node:child_process'
import type { PluginHandshake, PluginSpec } from './types.js'

type PluginManagerDeps = {
  spawnPlugin?: (spec: PluginSpec) => Promise<PluginHandshake>
}

const HANDSHAKE_TIMEOUT_MS = 5000

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

    const handshake = new Promise<PluginHandshake>((resolve, reject) => {
      child.stdout.once('data', (buffer) => {
        try {
          resolve(JSON.parse(buffer.toString()) as PluginHandshake)
        } catch (error) {
          reject(error)
        }
      })
      child.once('error', reject)
    })

    child.stdin.write(JSON.stringify({ type: 'handshake' }) + '\n')

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Plugin handshake timeout: ${spec.command}`)), HANDSHAKE_TIMEOUT_MS)
    )

    try {
      const result = await Promise.race([handshake, timeout])
      child.kill()
      return result
    } finally {
      child.stdin.end()
    }
  }
}