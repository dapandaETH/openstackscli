import type { ProviderAdapter, ProviderEvent, ProviderMessage } from './types.js'

export class MockProvider implements ProviderAdapter {
  readonly id = 'mock'

  async *stream(messages: ProviderMessage[]): AsyncIterable<ProviderEvent> {
    const last = messages.at(-1)?.content ?? ''
    yield { type: 'text-delta', text: `Mock response to: ${last}` }
    yield { type: 'message-complete' }
  }
}