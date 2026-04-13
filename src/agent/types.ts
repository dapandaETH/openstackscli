import type { ProviderMessage } from '../providers/types.js'

export type EngineRunInput = {
  providerId: string
  prompt: string
}

export type EngineDependencies = {
  providerRegistry: {
    get(providerId: string): { stream(messages: ProviderMessage[]): AsyncIterable<{ type: string; text?: string }> }
  }
}