import React from 'react'
import { Box, Text } from 'ink'

export function ChatScreen({ title }: { title: string }) {
  return (
    <Box flexDirection="column">
      <Text>{title}</Text>
      <Text>Interactive chat mode will render streamed output here.</Text>
    </Box>
  )
}
