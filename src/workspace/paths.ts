import path from 'node:path'

export function resolveWorkspacePath(workspaceRoot: string, targetPath: string) {
  const normalizedRoot = path.resolve(workspaceRoot)
  const relative = path.relative(normalizedRoot, path.resolve(normalizedRoot, targetPath))
  if (relative.startsWith('..')) {
    throw new Error(`Path escapes workspace: ${targetPath}`)
  }
  return path.resolve(normalizedRoot, targetPath)
}
