import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

export class GitService {
  constructor(private readonly workspaceRoot: string) {}

  async status() {
    return execFileAsync('git', ['status', '--short'], { cwd: this.workspaceRoot })
  }

  async diff() {
    return execFileAsync('git', ['diff', '--stat'], { cwd: this.workspaceRoot })
  }

  async log() {
    return execFileAsync('git', ['log', '--oneline', '-5'], { cwd: this.workspaceRoot })
  }

  isCommitAllowed(userApproved: boolean) {
    return userApproved
  }

  async commit(message: string, userApproved: boolean) {
    if (!this.isCommitAllowed(userApproved)) {
      throw new Error('Commit requires explicit approval')
    }

    return execFileAsync('git', ['commit', '-m', message], { cwd: this.workspaceRoot })
  }
}
