import { buildCli } from './cli.js'

const program = await buildCli()
await program.parseAsync(process.argv)
