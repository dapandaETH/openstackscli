import fs from 'node:fs/promises'
import { resolveWorkspacePath } from '../../workspace/paths.js'

export function createReadFileTool(workspaceRoot: string) {
  return {
    name: 'read_file',
    async execute(input: { path: string }) {
      const filePath = resolveWorkspacePath(workspaceRoot, input.path)
      return fs.readFile(filePath, 'utf8')
    }
  }
}
