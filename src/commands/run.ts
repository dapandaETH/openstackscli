export function registerRunCommand(program: {
  command(name: string): { description(text: string): unknown }
}) {
  program.command('run').description('Run one-shot prompt execution')
}
