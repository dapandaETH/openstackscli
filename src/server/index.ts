import express from 'express'
import { createServer } from 'node:http'
import { WebSocketServer, type WebSocket } from 'ws'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { AgentEngine } from '../agent/engine.js'
import { ProviderRegistry } from '../providers/registry.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const defaultProviderId = process.env.OPENCODE_API_KEY ? 'opencode' : 'mock'

const registry = new ProviderRegistry()

function handleConnection(ws: WebSocket) {
  const engine = new AgentEngine({ providerRegistry: registry })

  ws.on('message', async (data: Buffer | ArrayBuffer | string) => {
    const text = data instanceof Buffer ? data.toString() : String(data)

    let payload: { type: string; prompt?: string; providerId?: string }
    try {
      payload = JSON.parse(text)
    } catch {
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }))
      return
    }

    if (payload.type !== 'prompt' || typeof payload.prompt !== 'string') {
      ws.send(JSON.stringify({ type: 'error', message: 'Expected { "type": "prompt", "prompt": "..." }' }))
      return
    }

    const providerId = payload.providerId ?? defaultProviderId
    ws.send(JSON.stringify({ type: 'start' }))

    try {
      await engine.run({ providerId, prompt: payload.prompt }, (chunk) => {
        ws.send(JSON.stringify({ type: 'text', text: chunk }))
      })
      ws.send(JSON.stringify({ type: 'end' }))
    } catch (err) {
      ws.send(JSON.stringify({ type: 'error', message: (err as Error).message }))
    }
  })

  ws.on('close', () => {
  })
}

export async function startServer(opts: { port: number; host?: string }): Promise<void> {
  const host = opts.host ?? '0.0.0.0'
  const { port } = opts
  const displayHost = host === '0.0.0.0' ? 'localhost' : host

  const app = express()
  const httpServer = createServer(app)

  app.use(express.static(path.join(__dirname, 'public')))

  const wss = new WebSocketServer({ server: httpServer })
  wss.on('connection', handleConnection)

  process.on('SIGINT', () => { httpServer.close(); process.exit(0) })
  process.on('SIGTERM', () => { httpServer.close(); process.exit(0) })

  return new Promise((resolve, reject) => {
    httpServer.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Try a different port.`)
        process.exit(1)
      }
      reject(err)
    })

    httpServer.listen(port, host, () => {
      console.log(`http://${displayHost}:${port}  provider=${defaultProviderId}`)
      resolve()
    })
  })
}