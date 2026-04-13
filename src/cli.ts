import { Command } from 'commander'
import { registerRunCommand } from './commands/run.js'

export async function buildCli() {
  const program = new Command()

  program.name('openstacks').description('Coding agent CLI')
  registerRunCommand(program)

  const { registerSessionCommand } = await import('./commands/session.js')
  registerSessionCommand(program)

  return program
}
