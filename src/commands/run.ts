import type { Command } from 'commander'

export function registerRunCommand(program: Command) {
  program.command('run').description('Run one-shot prompt execution')
}
