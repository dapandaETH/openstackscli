import { describe, expect, it } from 'vitest'
import { PluginManager } from '../../src/plugins/manager.js'

describe('PluginManager', () => {
  it('loads tools declared during handshake', async () => {
    const manager = new PluginManager({
      spawnPlugin: async () => ({
        name: 'example',
        tools: [{ name: 'echo_tool', inputSchema: { type: 'object' } }]
      })
    })

    const plugins = await manager.load([{ command: 'example-plugin' }])
    expect(plugins[0]?.tools[0]?.name).toBe('echo_tool')
  })
})