# openstacks

A clean-room coding agent CLI inspired by OpenCode. V1 focuses on local developer workflows: interactive chat, safe tool execution, repo-aware context, session persistence, and a provider-agnostic model layer.

## Requirements

- Node.js 18, 20, or 22 (LTS versions recommended)
- macOS or Linux

> **Note:** The interactive TUI (`openstacks sessions`) requires Node.js 18–22. Node 23+ has a `react-reconciler` compatibility issue with `ink@5`. The `openstacks run` and `openstacks serve` commands work on all Node.js versions.

## Installation

### From source (recommended for now)

```bash
git clone https://github.com/dapandaETH/openstackscli.git
cd openstackscli
npm install

# Run without installing
node ./bin/openstacks.js run "hello"

# Or link globally
npm link
openstacks run "hello"   # works globally after npm link
```

### Uninstall global link

```bash
npm unlink openstacks
```

## Quick Start

```bash
# One-shot prompt — simplest way to try it
node ./bin/openstacks.js run "what files are in this repo"

# Interactive chat session
node ./bin/openstacks.js sessions
```

The one-shot command streams the mock provider's response to your terminal and persists a session automatically.

## Commands

### `openstacks run <prompt>`

Run a single prompt and exit. Streams output to stdout.

```bash
node ./bin/openstacks.js run "list the TypeScript files in src/"
```

**What it does:**
1. Loads workspace context from the current directory
2. Sends the prompt to the configured provider (mock in v1)
3. Streams the response to stdout
4. Saves the conversation as a session to `~/.openstacks/sessions/`

### `openstacks sessions`

Open the interactive session picker (TUI).

```bash
node ./bin/openstacks.js sessions
```

**What it does:**
1. Lists all saved sessions, most recent first
2. Lets you pick a session to resume or start fresh
3. Streams responses interactively

Requires Node.js 18–22.

### `openstacks serve`

Start a local web server with a browser-based chat UI.

```bash
node ./bin/openstacks.js serve
# http://localhost:3000

# Custom port or host
node ./bin/openstacks.js serve --port 8080 --host 0.0.0.0
```

**What it does:**
1. Starts an HTTP + WebSocket server on the configured host:port
2. Serves a browser-based chat UI at the root URL
3. Each prompt is sent to the agent engine and streamed back in real time
4. WebSocket protocol: send `{ "type": "prompt", "prompt": "..." }`, receive `{ "type": "start" }` → `{ "type": "text", "text": "..." }` → `{ "type": "end" }`

Open `http://localhost:3000` in your browser to start chatting.

## Session Management

Sessions are stored as JSON files in `~/.openstacks/sessions/`.

```bash
# Sessions are auto-named from your first prompt
# e.g. ~/.openstacks/sessions/<uuid>.json

# List your sessions
ls ~/.openstacks/sessions/

# Inspect a session
cat ~/.openstacks/sessions/<uuid>.json

# Delete a session
rm ~/.openstacks/sessions/<uuid>.json
```

## Configuration

`openstacks` resolves config in this order (later overrides earlier):

1. CLI flags
2. Project config (`.openstacks/config.json` in the repo)
3. Selected profile
4. Global defaults

### Global config

Stored at `~/.openstacks/config.json`:

```json
{
  "provider": "mock",
  "model": "mock-model",
  "approvalMode": "risky-only"
}
```

### Project config

Create `.openstacks/config.json` in your repo root:

```json
{
  "provider": "openai",
  "model": "gpt-4o",
  "approvalMode": "always-ask"
}
```

### Approval modes

| Mode | Behavior |
|------|----------|
| `risky-only` | Auto-run safe actions, ask before risky ones (default) |
| `always-ask` | Ask before every action |
| `trusted` | Auto-run everything without asking |

### What counts as risky

In v1, risky actions are:
- destructive shell commands (`rm`, `mv`, `git reset`, `git clean`, `git checkout --`)
- network access (`curl`, `wget`, `scp`, `ssh`)
- file writes outside the workspace

## Plugins

External tools run as child processes over stdio using a small JSON-RPC-like protocol.

### Plugin protocol

A plugin process receives a handshake on startup:

```
# Plugin receives (stdin):
{"type": "handshake"}

# Plugin responds (stdout):
{
  "name": "my-tool-plugin",
  "tools": [
    { "name": "my_tool", "inputSchema": { "type": "object", "properties": {} } }
  ]
}
```

### Registering plugins

Add plugins to your global config:

```json
{
  "plugins": [
    { "command": "my-plugin", "args": [] }
  ]
}
```

Plugin registration via project config and CLI flags is a planned post-v1 feature.

## Built-in Tools

V1 includes these built-in tools:

| Tool | Description | Risky? |
|------|-------------|--------|
| `read_file` | Read a file within the workspace | No |
| `write_file` | Write/edit a file within the workspace | No |
| `run_shell` | Execute a shell command | Depends |

Shell commands are risk-classified: destructive commands and network access are gated.

## Git Integration

`openstacks` is git-aware in v1:

- `git status` — short status of the repo
- `git diff` — stat-level diff
- `git log` — last 5 commits

Commit creation always requires explicit user approval:

```
openstacks will run: git commit -m "your message"
Allow? [y/N]
```

Branch management and PR creation are post-v1 features.

## Development

```bash
npm install        # install dependencies
npm test           # run tests (12 passing)
npm run typecheck  # TypeScript check
npm run dev -- run "hello"  # dev mode with hot reload via tsx
```

## Architecture

`openstacks` is a modular monolith TypeScript CLI:

```
src/
├── agent/        # turn loop, tool orchestration, approval gating
├── cli/          # command registration, entrypoint
├── commands/     # run, session commands
├── config/       # config loading with precedence resolution
├── git/          # git status/diff/log/commit helpers
├── providers/    # provider registry, adapter interface, mock provider
├── sessions/      # JSON session persistence
├── tools/         # tool registry, approval policy, built-in tools
├── plugins/       # stdio plugin manager
├── tui/           # Ink/React interactive UI components
└── workspace/     # path validation, diff/apply helpers
```

The same agent engine powers both `run` (one-shot) and `sessions` (interactive TUI).

## Current V1 Scope

- TypeScript/npm CLI targeting macOS and Linux
- Interactive TUI plus one-shot command mode
- Modular monolith with provider-agnostic streaming engine
- Built-in tools: file read/write/edit, shell execution, diff/apply
- External plugins via stdio child-process protocol
- Configurable approval policy (default: ask only for risky actions)
- Local JSON session persistence with interactive resume flows
- Git status, diff, log, and explicit-approval commit creation

## Post-V1 Roadmap

These are explicit future options, not commitments:
- Real provider adapters (OpenAI, Anthropic, local models)
- Richer plugin capabilities
- Extracting the agent engine as a reusable package
- Broader git workflow support
- Windows support
