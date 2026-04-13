#!/usr/bin/env node
import { register } from 'tsx/esm/api'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'

const envPath = resolve(import.meta.dirname, '..', '.env')
if (existsSync(envPath)) {
  const { config } = await import('dotenv')
  config({ path: envPath })
}

register()
await import(new URL('../src/index.ts', import.meta.url))