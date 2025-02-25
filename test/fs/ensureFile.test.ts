import { readFile, open, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { ensureFile } from 'src'
import { createTempDir, cleanupDir, tempFileName } from 'test/test-utils'
import { fileURLToPath } from 'node:url'
import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import { existsSync } from 'node:fs'

describe('ensureFile', () => {
    const currentFolder = dirname(fileURLToPath(import.meta.url))
    const tempDir = join(currentFolder, 'temp-ensureFile')

    beforeAll(async () => {
        await createTempDir(tempDir)
    })

    afterAll(async () => {
        await cleanupDir(tempDir)
    })

    it('should create a new file with default empty content if it doesn’t exist', async () => {
        const path = tempFileName(tempDir)

        expect(existsSync(path)).toBe(false)

        await ensureFile(path)

        expect(existsSync(path)).toBe(true)
        expect(await readFile(path, 'utf8')).toBe('')
    })

    it('should create a new file with specified content if it doesn’t exist', async () => {
        const path = tempFileName(tempDir)
        const testContent = 'Test content'

        expect(existsSync(path)).toBe(false)

        await ensureFile(path, testContent)

        expect(existsSync(path)).toBe(true)
        expect(await readFile(path, 'utf8')).toBe(testContent)
    })

    it('should do nothing if the file already exists', async () => {
        const path = tempFileName(tempDir)
        const initialContent = 'Initial content'

        // Create the file first
        await writeFile(path, initialContent, 'utf8')
        expect(existsSync(path)).toBe(true)

        await ensureFile(path, 'Different content')

        // Check that the original content remains
        expect(await readFile(path, 'utf8')).toBe(initialContent)
    })
})
