import { open, readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { replaceFileContent } from 'src'
import { createTempDir, createTempFile, cleanup, cleanupDir, tempFileName } from 'test/test-utils'
import { fileURLToPath } from 'node:url'
import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import getFileContent from 'src/fs/getFileContent'

const content = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5'

describe('replaceFileContent', () => {
    const tempDir = join(dirname(fileURLToPath(import.meta.url)), 'temp')

    beforeAll(async () => {
        // Create a temporary directory for tests
        await createTempDir(tempDir)
    })

    afterAll(async () => {
        // Clean up the temporary directory after all tests
        await cleanupDir(tempDir)
    })

    it('should replace a single line', async () => {
        const path = tempFileName(tempDir)
        await createTempFile(path, content)
        const handle = await open(path, 'r+') // Open in read-write mode
        try {
            // Replace line 3 with new content
            await replaceFileContent(handle, await getFileContent(handle), 'New line 3 content', 2)

            // Read the file and verify the content
            const fileContent = await readFile(path, 'utf8')
            expect(fileContent).toBe('Line 1\nLine 2\nNew line 3 content\nLine 4\nLine 5')
        } finally {
            await handle.close() // Always close the file handle
            await cleanup(path)
        }
    })

    it('should replace a range of lines', async () => {
        const path = tempFileName(tempDir)
        await createTempFile(path, content)
        const handle = await open(path, 'r+') // Open in read-write mode
        try {
            // Replace lines 2 to 4 with new content
            await replaceFileContent(handle, await getFileContent(handle), 'New line 2\nNew line 3\nNew line 4', 1, 3)

            // Read the file and verify the content
            expect(await readFile(path, 'utf8')).toBe('Line 1\nNew line 2\nNew line 3\nNew line 4\nLine 5')
        } finally {
            await handle.close() // Always close the file handle
            await cleanup(path)
        }
    })

    it('should replace until the end of the file if endLine is not provided', async () => {
        const path = tempFileName(tempDir)
        await createTempFile(path, content)
        const handle = await open(path, 'r+') // Open in read-write mode
        try {
            // Replace from line 3 to the end of the file
            await replaceFileContent(handle, await getFileContent(handle), 'New line 3\nNew line 4\nNew line 5', 2)

            // Read the file and verify the content
            expect(await readFile(path, 'utf8')).toBe('Line 1\nLine 2\nNew line 3\nNew line 4\nNew line 5')
        } finally {
            await handle.close() // Always close the file handle
            await cleanup(path)
        }
    })
})
