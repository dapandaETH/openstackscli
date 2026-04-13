import { describe, expect, it } from 'vitest'
import { MockProvider } from '../../src/providers/mock-provider.js'

describe('MockProvider', () => {
  it('streams normalized text events', async () => {
    const provider = new MockProvider()
    const chunks: string[] = []

    for await (const event of provider.stream([{ role: 'user', content: 'hello' }])) {
      if (event.type === 'text-delta') {
        chunks.push(event.text)
      }
    }

    expect(chunks.join('')).toContain('hello')
  })
})