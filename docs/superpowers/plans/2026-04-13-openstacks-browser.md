# openstacks Browser Terminal — Implementation Plan

## Context

Add a browser-accessible terminal UI to openstacks. The existing CLI (`openstacks run`, `openstacks sessions`) continues to work as-is. A new `openstacks serve` command starts a local web server that renders the Ink TUI in a browser via xterm.js over WebSocket.

## Architecture

```
Browser (xterm.js) ←→ WebSocket ←→ Node.js server ←→ node-pty ←→ openstacks sessions (TTY)
```

The approach: use `node-pty` to spawn a real PTY running `openstacks sessions`, then relay the PTY's I/O over WebSocket to the browser's xterm.js. This preserves Ink's full rendering (colors, layout, key handling) without any changes to the existing TUI code.

## Task 1: Add Dependencies and Register Serve Command

**Files to modify:**
- `package.json` — add `express`, `ws`, `node-pty`
- `src/cli.ts` — add `registerServeCommand` import and call (lazy-loaded like session)
- `src/commands/serve.ts` — new file, registers `serve` command with port option (default 3000)

**Details:**
- `node-pty` is a native module — no special ESM handling needed at the import site
- `ws` and `express` are pure JS
- Serve command must be lazy-loaded like session command to avoid loading native modules at CLI startup

## Task 2: Create WebSocket + HTTP Server with PTY Bridge

**New file: `src/server/index.ts`**

Exports a single `startServer(port: number)` async function.

**Behavior:**
1. Create Express HTTP server on the given port
2. Serve static files from `src/server/public/`
3. Create WebSocket server attached to the HTTP server
4. On WebSocket connection:
   a. Spawn PTY running `openstacks sessions` with environment configured for interactive use
   b. Relay PTY stdout → WebSocket send (binary)
   c. Relay WebSocket message → PTY stdin (binary)
   d. On PTY exit, close WebSocket
   e. On WebSocket close, kill PTY
5. Listen on the configured port, log the URL

**Edge cases:**
- Port already in use → exit with error
- PTY spawn failure → close WebSocket with error message
- Multiple concurrent connections → each gets its own PTY session
- Server shutdown → kill all PTY processes

## Task 3: Create Browser Client HTML Page with xterm.js

**New file: `src/server/public/index.html`**

A single self-contained HTML page (no build step needed):

- Load xterm.js + xterm-addon-attach from CDN (unpkg or jsdelivr)
- Connect WebSocket to `ws://localhost:{port}`
- Use `xterm-addon-attach` to connect terminal to WebSocket
- Full-screen terminal with dark theme (CSS included inline)
- No other UI — pure terminal experience

## Task 4: Update README

Add section for the `serve` command documenting:
- `openstacks serve [--port 3000]`
- Browser access URL
- `node-pty` native dependency (may need rebuild on some platforms)
- Note that this requires Node 18–22 (same as sessions)

## Dependencies

```json
{
  "express": "^4.x",
  "ws": "^8.x",
  "node-pty": "^1.x"
}
```

## Verification

- `npm test` passes (existing tests unchanged)
- `npm run typecheck` passes
- `openstacks serve` starts server on port 3000
- Opening `http://localhost:3000` shows xterm.js terminal
- Terminal renders the sessions TUI output
- Input in browser terminal is relayed to the TUI
