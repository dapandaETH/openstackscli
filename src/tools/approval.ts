import path from 'node:path'
import type { RiskInput } from './types.js'

const DESTRUCTIVE_SHELL_PATTERN = /\b(rm|mv|git reset|git clean|git checkout --)\b/
const NETWORK_PATTERN = /\b(curl|wget|scp|ssh)\b/

export function isRiskyAction(input: RiskInput, workspaceRoot?: string) {
  if (input.kind === 'shell') {
    return DESTRUCTIVE_SHELL_PATTERN.test(input.command) || NETWORK_PATTERN.test(input.command)
  }

  if (input.kind === 'file-write' && workspaceRoot) {
    const resolved = path.resolve(workspaceRoot, input.path)
    const normalizedRoot = path.resolve(workspaceRoot)
    if (!resolved.startsWith(normalizedRoot + path.sep) && resolved !== normalizedRoot) {
      return true
    }
  }

  return false
}
