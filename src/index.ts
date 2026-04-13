import { buildCli } from './cli.js'

await buildCli().parseAsync(process.argv)
