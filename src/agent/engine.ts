import { buildMessages } from './context.js'
import type { EngineDependencies, EngineRunInput } from './types.js'

export class AgentEngine {
  constructor(private readonly deps: EngineDependencies) {}

  async run(input: EngineRunInput, onText: (chunk: string) => void) {
    const provider = this.deps.providerRegistry.get(input.providerId)

    for await (const event of provider.stream(buildMessages(input.prompt))) {
      if (event.type === 'text-delta' && event.text) {
        onText(event.text)
      }
    }
  }
}