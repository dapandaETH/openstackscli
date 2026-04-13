import fs from 'node:fs/promises'
import path from 'node:path'
import { resolveWorkspacePath } from '../../workspace/paths.js'

export function createWriteFileTool(workspaceRoot: string) {
  return {
    name: 'write_file',
    async execute(input: { path: string; content: string }) {
      const filePath = resolveWorkspacePath(workspaceRoot, input.path)
      await fs.mkdir(path.dirname(filePath), { recursive: true })
      await fs.writeFile(filePath, input.content, 'utf8')
      return { ok: true }
    }
  }
}
