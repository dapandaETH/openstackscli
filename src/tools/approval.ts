import type { RiskInput } from './types.js'

const DESTRUCTIVE_SHELL_PATTERN = /\b(rm|mv|git reset|git clean)\b/
const NETWORK_PATTERN = /\b(curl|wget|scp|ssh)\b/

export function isRiskyAction(input: RiskInput) {
  if (input.kind === 'shell') {
    return DESTRUCTIVE_SHELL_PATTERN.test(input.command) || NETWORK_PATTERN.test(input.command)
  }

  if (input.kind === 'file-write') {
    return input.path.startsWith('..')
  }

  return false
}
