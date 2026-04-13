import type { Command } from 'commander'
import { SessionStore } from '../sessions/store.js'
import { renderApp } from '../tui/app.js'

export function registerSessionCommand(program: Command) {
  program
    .command('sessions')
    .description('Open the interactive session picker')
    .action(async () => {
      const store = new SessionStore('.openstacks/sessions')
      const sessions = await store.list()
      renderApp(sessions)
    })
}
