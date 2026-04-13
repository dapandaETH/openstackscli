export type ResolvedConfig = {
  provider: string
  model: string
  approvalMode: 'always-ask' | 'risky-only' | 'trusted'
}

export type PartialConfig = Partial<ResolvedConfig>
