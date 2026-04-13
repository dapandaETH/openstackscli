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

function defined<T>(value: T | undefined): value is T {
  return value !== undefined
}

export function resolveConfig(input: ResolveConfigInput): ResolvedConfig {
  const layers: Array<Partial<ResolvedConfig> | ResolvedConfig> = [
    DEFAULT_CONFIG,
    input.global,
    input.profile,
    input.project,
    input.cli
  ].filter(defined)

  const result = { ...DEFAULT_CONFIG }
  for (const layer of layers) {
    for (const [key, value] of Object.entries(layer)) {
      if (value !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(result as any)[key] = value
      }
    }
  }
  return result as ResolvedConfig
}
