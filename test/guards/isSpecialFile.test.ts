import { stat } from 'node:fs/promises'
import { createServer } from 'node:net'
import { join, dirname } from 'node:path'
import { isSpecialFile } from 'src'
import { createTempDir, cleanup, cleanupDir, createTempFile } from 'test/test-utils'
import { fileURLToPath } from 'node:url'
import { describe, beforeAll, afterAll, it, expect } from 'vitest'

describe('isSpecialFile', () => {
    const tempDir = join(dirname(fileURLToPath(import.meta.url)), 'temp-isSpecialFile')
    const tempFilePath = join(tempDir, 'testfile.txt')
    const tempDirPath = join(tempDir, 'testdir')
    const socketPath = join(tempDir, 'testsocket')

    beforeAll(async () => {
        // Create a temporary directory for tests
        await createTempDir(tempDir)
    })

    afterAll(async () => {
        // Clean up the temporary directory after all tests
        await cleanup(tempFilePath)
        await cleanup(socketPath)
        await cleanupDir(tempDirPath)
        await cleanupDir(tempDir)
    })

    it('should return false for a regular file', async () => {
        await createTempFile(tempFilePath, 'test content')
        const stats = await stat(tempFilePath)
        expect(isSpecialFile(stats)).toBe(false)
    })

    it('should return false for a directory', async () => {
        await createTempDir(tempDirPath)
        const stats = await stat(tempDirPath)
        expect(isSpecialFile(stats)).toBe(false)
    })

    it('should return true for a socket', async () => {
        if (process.platform === 'win32') {
            expect(true).toBe(true)
            return
        }
        // Create a Unix socket
        const server = createServer(socket => {
            socket.write('Hello')
            socket.end()
        })

        await new Promise<void>(resolve => {
            server.listen(socketPath, () => resolve())
        })

        const stats = await stat(socketPath)
        expect(isSpecialFile(stats)).toBe(true)

        // Close the server
        await new Promise<void>(resolve => {
            server.close(() => resolve())
        })
    })
})
