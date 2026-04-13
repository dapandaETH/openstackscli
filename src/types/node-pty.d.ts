declare module 'node-pty' {
  export interface IPty {
    onData(callback: (data: string) => void): void
    onExit(callback: (exitData: { exitReason: string; exitCode: number }) => void): void
    write(data: string): void
    resize(cols: number, rows: number): void
    kill(): void
  }

  export interface ISpawnOptions {
    name?: string
    cols?: number
    rows?: number
    cwd?: string
    env?: Record<string, string>
  }

  export function spawn(
    file: string,
    args: string[],
    options?: ISpawnOptions
  ): IPty
}
