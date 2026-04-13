import { describe, expect, it } from 'vitest'
import { resolveConfig } from '../../src/config/load-config.js'

describe('resolveConfig', () => {
  it('prefers CLI flags over project and global defaults', () => {
    const config = resolveConfig({
      cli: { provider: 'cli-provider', model: 'cli-model' },
      project: { provider: 'project-provider', model: 'project-model' },
      global: { provider: 'global-provider', model: 'global-model' }
    })

    expect(config.provider).toBe('cli-provider')
    expect(config.model).toBe('cli-model')
  })
})
