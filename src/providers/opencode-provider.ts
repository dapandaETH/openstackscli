import { createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'
import type { ProviderAdapter, ProviderEvent, ProviderMessage } from './types.js'

export class OpenCodeProvider implements ProviderAdapter {
  readonly id = 'opencode'
  private readonly model

  constructor(apiKey: string, baseURL = 'https://opencode.ai/zen/v1') {
    const opencode = createOpenAI({ apiKey, baseURL })
    this.model = opencode('gpt-5-nano')
  }

  async *stream(messages: ProviderMessage[]): AsyncIterable<ProviderEvent> {
    const coreMessages = messages.map((m) => ({
      role: m.role as 'system' | 'user' | 'assistant',
      content: m.content,
    }))

    const result = streamText({
      model: this.model,
      messages: coreMessages,
    })

    for await (const part of result.textStream) {
      yield { type: 'text-delta', text: part }
    }

    yield { type: 'message-complete' }
  }
}