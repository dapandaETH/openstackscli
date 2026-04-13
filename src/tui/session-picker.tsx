import React from 'react'
import { Box, Text } from 'ink'
import type { SessionRecord } from '../sessions/types.js'

export function SessionPicker({ sessions }: { sessions: SessionRecord[] }) {
  return (
    <Box flexDirection="column">
      <Text>Select a session:</Text>
      {sessions.map((session) => (
        <Text key={session.id}>{session.title}</Text>
      ))}
      <Text>Start new session</Text>
    </Box>
  )
}
