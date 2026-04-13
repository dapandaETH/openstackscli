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
    } catch (err) {
      const code = (err as { code?: string }).code
      if (code === 'ENOENT') return null
      throw err
    }
  }

  async list() {
    try {
      const files = await fs.readdir(this.dir)
      const sessions = await Promise.all(
        files.filter((file) => file.endsWith('.json')).map(async (file) => {
          const content = await fs.readFile(path.join(this.dir, file), 'utf8')
          return JSON.parse(content) as SessionRecord
        })
      )

      return sessions.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    } catch (err) {
      const code = (err as { code?: string }).code
      if (code === 'ENOENT') return []
      throw err
    }
  }

  private filePath(id: string) {
    return path.join(this.dir, `${id}.json`)
  }
}
