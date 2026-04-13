import { describe, expect, it } from 'vitest'
import { createBuiltInRegistry } from '../../src/tools/registry.js'

describe('createBuiltInRegistry', () => {
  it('registers file and shell tools', () => {
    const registry = createBuiltInRegistry('/repo')

    expect(registry.get('read_file')).toBeDefined()
    expect(registry.get('write_file')).toBeDefined()
    expect(registry.get('run_shell')).toBeDefined()
  })
})
