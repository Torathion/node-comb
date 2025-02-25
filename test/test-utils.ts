import { chmod, mkdir, rm, unlink, writeFile } from 'node:fs/promises'
import type { MakeDirectoryOptions, RmOptions } from 'node:fs'
import { Chmod } from '../src'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { vi, type MockInstance } from 'vitest'

const mkdirOptions: MakeDirectoryOptions = { recursive: true, mode: 0o777 }
const rmOptions: RmOptions = { recursive: true, force: true }

export function tempFileName(dir: string, ext = 'txt'): string {
    return join(dir, `test-${randomUUID()}.${ext}`)
}

// Utility to mock a stream's write method
export function mockStd(stream: NodeJS.WriteStream): MockInstance<(chunk: Buffer | string) => boolean> {
    return vi.spyOn(stream, 'write').mockImplementation(() => {
        return true // Simulate successful write
    })
}
export async function cleanup(path: string): Promise<void> {
    try {
        await unlink(path)
    } catch {}
}

export async function cleanupDir(path: string): Promise<void> {
    try {
        await rm(path, rmOptions)
    } catch {}
}

export async function createTempDir(path: string): Promise<void> {
    await mkdir(path, mkdirOptions)
}

export async function createTempFile(path: string, content = '', permissions = Chmod.All): Promise<void> {
    await writeFile(path, content)
    await chmod(path, permissions)
}

export async function lock(path: string): Promise<void> {
    await chmod(path, Chmod.Locked)
}
