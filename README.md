# openstacks

Early TypeScript implementation of the openstacks coding-agent CLI.

## Development

- `npm install`
- `npm test`
- `npm run dev -- run "hello"`

## Commands

- `openstacks run <prompt>`: run a one-shot prompt and persist a session
- `openstacks sessions`: open the interactive session picker

## Current V1 Scope

- mock provider-backed agent engine
- JSON session persistence
- interactive session picker
- built-in file and shell tools
- stdio plugin handshake support
- git status, diff, log, and explicit-approval commits
