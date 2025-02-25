import { open } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { isDirEmpty, InvalidDirectoryPathError } from 'src'
import { createTempDir, cleanupDir, tempFileName, createTempFile } from 'test/test-utils'
import { fileURLToPath } from 'node:url'
import { describe, beforeAll, afterAll, it, expect } from 'vitest'

describe('isDirEmpty', () => {
    const currentFolder = dirname(fileURLToPath(import.meta.url))
    const tempDir = join(currentFolder, 'temp')

    beforeAll(async () => {
        // Create a temporary directory for tests
        await createTempDir(tempDir)
    })

    afterAll(async () => {
        // Clean up the temporary directory after all tests
        await cleanupDir(tempDir)
    })

    it('should return false for a non-empty directory', async () => {
        // Create a temp directory with a file in it
        const nonEmptyDir = join(tempDir, 'non-empty')
        await createTempDir(nonEmptyDir)
        const filePath = tempFileName(nonEmptyDir)
        await createTempFile(filePath, 'test content')

        expect(await isDirEmpty(nonEmptyDir)).toBe(false)

        // Clean up
        const handle = await open(filePath, 'r')
        await handle.close()
        await cleanupDir(nonEmptyDir)
    })

    it('should return true for an empty directory', async () => {
        const emptyDir = join(tempDir, 'empty')
        await createTempDir(emptyDir)

        expect(await isDirEmpty(emptyDir)).toBe(true)

        // Clean up
        await cleanupDir(emptyDir)
    })

    it('should return false for current folder with files', async () => {
        expect(await isDirEmpty(currentFolder)).toBe(false)
    })

    it('should throw InvalidDirectoryPathError for invalid paths', async () => {
        await expect(isDirEmpty('')).rejects.toThrow(InvalidDirectoryPathError)
        await expect(isDirEmpty(import.meta.url)).rejects.toThrow(InvalidDirectoryPathError)
        await expect(isDirEmpty(resolve(currentFolder, 'nonexistent-dir'))).rejects.toThrow(InvalidDirectoryPathError)
    })
})
