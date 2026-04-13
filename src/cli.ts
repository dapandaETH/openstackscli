import { Command } from 'commander'
import { registerRunCommand } from './commands/run.js'

export function buildCli() {
  const program = new Command()

  program.name('openstacks').description('Coding agent CLI')
  registerRunCommand(program)

  return program
}
