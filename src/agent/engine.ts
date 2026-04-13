import { buildMessages } from './context.js'
import type { EngineDependencies, EngineRunInput } from './types.js'
import type { ProviderMessage } from '../providers/types.js'

export class AgentEngine {
  constructor(private readonly deps: EngineDependencies) {}

  async run(input: EngineRunInput, onText: (chunk: string) => void): Promise<{ messages: ProviderMessage[] }> {
    const provider = this.deps.providerRegistry.get(input.providerId)
    const messages = buildMessages(input.prompt)
    let assistantText = ''

    for await (const event of provider.stream(messages)) {
      if (event.type === 'text-delta' && event.text) {
        assistantText += event.text
        onText(event.text)
      }
    }

    return {
      messages: [
        ...messages,
        { role: 'assistant' as const, content: assistantText }
      ]
    }
  }
}