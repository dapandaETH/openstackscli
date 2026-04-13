import { describe, expect, it } from 'vitest'
import { isRiskyAction } from '../../src/tools/approval.js'

describe('isRiskyAction', () => {
  it('marks rm commands as risky', () => {
    expect(isRiskyAction({ kind: 'shell', command: 'rm -rf .git' })).toBe(true)
  })

  it('marks network commands as risky', () => {
    expect(isRiskyAction({ kind: 'shell', command: 'curl https://example.com' })).toBe(true)
  })

  it('allows safe workspace reads', () => {
    expect(isRiskyAction({ kind: 'file-read', path: '/repo/src/index.ts' })).toBe(false)
  })
})
