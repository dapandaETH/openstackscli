export type RiskInput =
  | { kind: 'shell'; command: string }
  | { kind: 'file-read'; path: string }
  | { kind: 'file-write'; path: string }

export type ToolDefinition = {
  name: string
  execute(input: unknown): Promise<unknown>
}
