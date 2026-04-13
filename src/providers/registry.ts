import { MockProvider } from './mock-provider.js'
import type { ProviderAdapter } from './types.js'

export class ProviderRegistry {
  private readonly providers = new Map<string, ProviderAdapter>([['mock', new MockProvider()]])

  get(providerId: string) {
    const provider = this.providers.get(providerId)
    if (!provider) {
      throw new Error(`Unknown provider: ${providerId}`)
    }
    return provider
  }
}