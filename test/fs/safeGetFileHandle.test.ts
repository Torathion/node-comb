import { join, dirname } from 'node:path'
import { safeGetFileHandle } from 'src'
import { createTempDir, createTempFile, cleanup, cleanupDir } from 'test/test-utils'
import { fileURLToPath } from 'node:url'
import { describe, beforeAll, afterAll, it, expect } from 'vitest'

describe('safeGetFileHandle', () => {
    const tempDir = join(dirname(fileURLToPath(import.meta.url)), 'temp')
    const tempFilePath = join(tempDir, 'testfile.txt')
    const nonExistentFilePath = join(tempDir, 'nonexistent-file.txt')

    beforeAll(async () => {
        // Create a temporary directory for tests
        await createTempDir(tempDir)

        // Create a temporary file
        await createTempFile(tempFilePath, 'test content')
    })

    afterAll(async () => {
        // Clean up the temporary directory after all tests
        await cleanup(tempFilePath)
        await cleanupDir(tempDir)
    })

    it('should return a FileHandle for an existing file', async () => {
        const fileHandle = await safeGetFileHandle(tempFilePath, 'r')
        expect(fileHandle).toBeDefined()
        expect((await fileHandle!.readFile()).toString()).toBe('test content')
        await fileHandle?.close()
    })

    it('should return undefined for a non-existent file', async () => {
        const fileHandle = await safeGetFileHandle(nonExistentFilePath, 'r')
        expect(fileHandle).toBeUndefined()
    })
})
