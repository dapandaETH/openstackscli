import { describe, expect, it } from 'vitest'
import { buildCli } from '../../src/cli'

describe('buildCli', () => {
  it('registers the run command', () => {
    const program = buildCli()
    const command = program.commands.find((item) => item.name() === 'run')

    expect(command).toBeDefined()
  })
})
