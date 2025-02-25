import { open, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { createTempDir, cleanupDir, tempFileName, createTempFile } from '../test-utils'
import { fileURLToPath } from 'node:url'
import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import readFile from 'src/fs/readFile'

describe('readFile', () => {
    const currentFolder = dirname(fileURLToPath(import.meta.url))
    const tempDir = join(currentFolder, 'temp-readFile')

    beforeAll(async () => {
        await createTempDir(tempDir)
    })

    afterAll(async () => {
        await cleanupDir(tempDir)
    })

    it('reads content from an existing file', async () => {
        const path = tempFileName(tempDir)
        const content = 'Hello, world!\nThis is a test file.'
        await createTempFile(path, content)

        expect(await readFile(path)).toBe(content)

        // Cleanup
        const handle = await open(path, 'r')
        await handle.close()
    })

    it('reads empty file content', async () => {
        const path = tempFileName(tempDir)
        await createTempFile(path, '') // Empty file

        expect(await readFile(path)).toBe('')
    })

    it('throws an error when file does not exist', async () => {
        const path = join(tempDir, 'nonexistent.txt')

        await expect(readFile(path)).rejects.toThrow() // Expect any error from fs.open
    })

    it('throws an error when path is a directory', async () => {
        const dirPath = join(tempDir, 'test-dir')
        await createTempDir(dirPath)

        await expect(readFile(dirPath)).rejects.toThrow() // Expect error from fs.open
    })

    it('reads file with special characters', async () => {
        const path = tempFileName(tempDir)
        const content = 'Special chars: © é ñ 😊'
        await createTempFile(path, content)

        const result = await readFile(path)
        expect(result).toBe(content)

        // Cleanup
        const handle = await open(path, 'r')
        await handle.close()
    })

    it('reads large file content', async () => {
        const path = tempFileName(tempDir)
        const largeContent = 'A'.repeat(1024 * 1024) // 1MB of 'A's
        await writeFile(path, largeContent, 'utf8')

        const result = await readFile(path)
        expect(result).toBe(largeContent)

        // Cleanup
        const handle = await open(path, 'r')
        await handle.close()
    })
})
