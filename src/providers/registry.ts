import { MockProvider } from './mock-provider.js'
import { OpenCodeProvider } from './opencode-provider.js'
import type { ProviderAdapter } from './types.js'

export class ProviderRegistry {
  private readonly providers = new Map<string, ProviderAdapter>()

  constructor() {
    this.providers.set('mock', new MockProvider())

    const apiKey = process.env.OPENCODE_API_KEY
    if (apiKey) {
      const baseURL = process.env.OPENCODE_BASE_URL ?? 'https://opencode.ai/zen/v1'
      this.setOpenCodeKey(apiKey, baseURL)
    }
  }

  setOpenCodeKey(apiKey: string, baseURL = 'https://opencode.ai/zen/v1'): void {
    this.providers.set('opencode', new OpenCodeProvider(apiKey, baseURL))
  }

  get(providerId: string) {
    const provider = this.providers.get(providerId)
    if (!provider) {
      throw new Error(`Unknown provider: ${providerId}. Available: ${[...this.providers.keys()].join(', ')}`)
    }
    return provider
  }
}