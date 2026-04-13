import { describe, expect, it } from 'vitest'
import { GitService } from '../../src/git/service.js'

describe('GitService', () => {
  it('detects destructive git commands as risky', () => {
    const service = new GitService('/repo')
    expect(service.isCommitAllowed(false)).toBe(false)
    expect(service.isCommitAllowed(true)).toBe(true)
  })
})
