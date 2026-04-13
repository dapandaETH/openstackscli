import type { ToolDefinition } from './types.js'
import { createReadFileTool } from './builtins/read-file.js'
import { createRunShellTool } from './builtins/run-shell.js'
import { createWriteFileTool } from './builtins/write-file.js'

export function createBuiltInRegistry(workspaceRoot: string): Map<string, ToolDefinition> {
  return new Map<string, ToolDefinition>([
    ['read_file', createReadFileTool(workspaceRoot)],
    ['write_file', createWriteFileTool(workspaceRoot)],
    ['run_shell', createRunShellTool(workspaceRoot)]
  ])
}
