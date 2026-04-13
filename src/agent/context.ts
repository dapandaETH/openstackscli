import type { ProviderMessage } from '../providers/types.js'

export function buildMessages(prompt: string): ProviderMessage[] {
  return [{ role: 'user', content: prompt }]
}