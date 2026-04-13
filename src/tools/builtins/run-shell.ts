import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

export function createRunShellTool(workspaceRoot: string) {
  return {
    name: 'run_shell',
    async execute(input: { command: string }) {
      const result = await execFileAsync('sh', ['-lc', input.command], { cwd: workspaceRoot })
      return { stdout: result.stdout, stderr: result.stderr }
    }
  }
}
