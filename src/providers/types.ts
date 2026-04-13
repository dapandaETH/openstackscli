export type ProviderMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string
}

export type ProviderEvent =
  | { type: 'text-delta'; text: string }
  | { type: 'message_complete' }
  | { type: 'error'; message: string }

export interface ProviderAdapter {
  readonly id: string
  stream(messages: ProviderMessage[]): AsyncIterable<ProviderEvent>
}