export type SessionRecord = {
  id: string
  title: string
  workspaceRoot: string
  provider: string
  model: string
  messages: Array<{ role: 'user' | 'assistant' | 'tool'; content: string }>
  createdAt: string
  updatedAt: string
}
