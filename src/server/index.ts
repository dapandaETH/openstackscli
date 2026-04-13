import express from 'express'
import { createServer } from 'node:http'
import { WebSocketServer } from 'ws'
import { pathToFileURL } from 'node:url'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { dirname } from 'node:path'
import { fileURLToPath as fileURLToPathFn } from 'node:url'

let nodePty: typeof import('node-pty')
try {
  nodePty = await import('node-pty')
} catch {
  throw new Error(
    'Failed to import node-pty. This is a native module that must be rebuilt for your platform. ' +
    'Run: npm rebuild node-pty'
  )
}

const __dirname = dirname(fileURLToPathFn(import.meta.url))

export async function startServer(opts: { port: number; host: string }): Promise<void> {
  const { port, host } = opts
  const activePtys = new Set<import('node-pty').IPty>()

  const app = express()
  const httpServer = createServer(app)

  app.use(express.static(path.join(__dirname, 'public')))

  const wss = new WebSocketServer({ server: httpServer })

  wss.on('connection', (ws, req) => {
    const openstacksBin = resolve(__dirname, '..', '..', 'bin', 'openstacks.js')

    const pty = nodePty.spawn(process.execPath, [openstacksBin, 'sessions'], {
      name: 'xterm-256color',
      cols: 80,
      rows: 24,
      cwd: resolve(__dirname, '..', '..'),
      env: { ...process.env, TERM: 'xterm-256color' } as Record<string, string>
    })

    activePtys.add(pty)

    pty.onData((data: string) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(data)
      }
    })

    pty.onExit(({ exitCode }) => {
      activePtys.delete(pty)
      if (ws.readyState === ws.OPEN) {
        ws.close(1000, `PTY exited with code ${exitCode}`)
      }
    })

    ws.on('message', (data: Buffer | ArrayBuffer | string) => {
      const input = data instanceof Buffer ? data.toString() : String(data)
      pty.write(input)
    })

    ws.on('close', () => {
      activePtys.delete(pty)
      pty.kill()
    })

    ws.on('error', () => {
      activePtys.delete(pty)
      pty.kill()
    })
  })

  const shutdown = () => {
    for (const pty of activePtys) {
      pty.kill()
    }
    activePtys.clear()
    httpServer.close()
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)

  return new Promise((resolve, reject) => {
    httpServer.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Try a different port.`)
        process.exit(1)
      }
      reject(err)
    })

    httpServer.listen(port, host, () => {
      console.log(`http://${host}:${port}`)
      resolve()
    })
  })
}
