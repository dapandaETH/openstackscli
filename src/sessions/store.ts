import fs from 'node:fs/promises'
import path from 'node:path'
import type { SessionRecord } from './types.js'

export class SessionStore {
  constructor(private readonly dir: string) {}

  async save(session: SessionRecord) {
    await fs.mkdir(this.dir, { recursive: true })
    await fs.writeFile(this.filePath(session.id), JSON.stringify(session, null, 2), 'utf8')
    return session
  }

  async load(id: string) {
    try {
      const content = await fs.readFile(this.filePath(id), 'utf8')
      return JSON.parse(content) as SessionRecord
    } catch {
      return null
    }
  }

  private filePath(id: string) {
    return path.join(this.dir, `${id}.json`)
  }
}
