import React from 'react'
import { render } from 'ink'
import { SessionPicker } from './session-picker.js'
import type { SessionRecord } from '../sessions/types.js'

export function renderApp(sessions: SessionRecord[]) {
  return render(<SessionPicker sessions={sessions} />)
}
