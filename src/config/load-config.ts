import type { PartialConfig, ResolvedConfig } from './types.js'

type ResolveConfigInput = {
  cli?: PartialConfig
  project?: PartialConfig
  profile?: PartialConfig
  global?: PartialConfig
}

const DEFAULT_CONFIG: ResolvedConfig = {
  provider: 'mock',
  model: 'mock-model',
  approvalMode: 'risky-only'
}

export function resolveConfig(input: ResolveConfigInput): ResolvedConfig {
  return {
    ...DEFAULT_CONFIG,
    ...input.global,
    ...input.profile,
    ...input.project,
    ...input.cli
  }
}
