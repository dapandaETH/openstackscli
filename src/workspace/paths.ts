import path from 'node:path'

export function resolveWorkspacePath(workspaceRoot: string, targetPath: string) {
  const resolved = path.resolve(workspaceRoot, targetPath)
  const normalizedRoot = path.resolve(workspaceRoot)

  if (!resolved.startsWith(normalizedRoot)) {
    throw new Error(`Path escapes workspace: ${targetPath}`)
  }

  return resolved
}
