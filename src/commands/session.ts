import type { Command } from 'commander'
import { SessionStore } from '../sessions/store.js'
import { getSessionsDir } from '../config/paths.js'

export function registerSessionCommand(program: Command) {
  program
    .command('sessions')
    .description('Open the interactive session picker')
    .action(async () => {
      const store = new SessionStore(getSessionsDir())
      const sessions = await store.list()
      const { renderApp } = await import('../tui/app.js')
      renderApp(sessions)
    })
}
