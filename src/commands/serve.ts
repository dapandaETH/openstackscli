import type { Command } from 'commander'

export function registerServeCommand(program: Command) {
  program
    .command('serve')
    .description('Start the browser-accessible terminal server')
    .option('-p, --port <number>', 'Port to listen on', '3000')
    .option('--host <string>', 'Host to bind to', '0.0.0.0')
    .action(async (opts) => {
      try {
        const { startServer } = await import('../server/index.js')
        await startServer({
          port: Number(opts.port),
          host: opts.host,
        })
      } catch (err) {
        console.error('Failed to start server:', err)
        process.exit(1)
      }
    })
}
