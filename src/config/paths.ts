import path from 'node:path'
import os from 'node:os'

export function getOpenstacksHome() {
  return path.join(os.homedir(), '.openstacks')
}

export function getSessionsDir(baseDir = getOpenstacksHome()) {
  return path.join(baseDir, 'sessions')
}
