export type PluginTool = {
  name: string
  inputSchema: unknown
}

export type PluginHandshake = {
  name: string
  tools: PluginTool[]
}

export type PluginSpec = {
  command: string
  args?: string[]
}