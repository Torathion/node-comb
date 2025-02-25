import { symlink } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { isSymlink } from 'src'
import { createTempDir, createTempFile, cleanup, cleanupDir } from 'test/test-utils'
import { fileURLToPath } from 'node:url'
import { describe, beforeAll, afterAll, it, expect } from 'vitest'

describe('isSymlink', () => {
    const tempDir = join(dirname(fileURLToPath(import.meta.url)), 'temp-isSymlink')
    const tempFilePath = join(tempDir, 'testfile.txt')
    const tempDirPath = join(tempDir, 'testdir')
    const validSymlinkPath = join(tempDir, 'valid-symlink')
    const brokenSymlinkPath = join(tempDir, 'broken-symlink')

    beforeAll(async () => {
        // Create a temporary directory for tests
        await createTempDir(tempDir)

        // Create a temporary file and directory
        await createTempFile(tempFilePath, 'test content')
        await createTempDir(tempDirPath)

        // Create a valid symbolic link to the temporary file
        await symlink(tempFilePath, validSymlinkPath)

        // Create a broken symbolic link
        await symlink(join(tempDir, 'nonexistent-file'), brokenSymlinkPath)
    })

    afterAll(async () => {
        // Clean up the temporary directory after all tests
        await cleanup(validSymlinkPath)
        await cleanup(brokenSymlinkPath)
        await cleanup(tempFilePath)
        await cleanupDir(tempDirPath)
        await cleanupDir(tempDir)
    })

    it('should return true for a valid symbolic link to a file', async () => {
        const result = await isSymlink(validSymlinkPath)
        expect(result).toBe(true)
    })

    it('should return false for a broken symbolic link and checkValidity true', async () => {
        const result = await isSymlink(brokenSymlinkPath, true)
        expect(result).toBe(false)
    })

    it('should return true for a broken symbolic link and checkValidity false', async () => {
        const result = await isSymlink(brokenSymlinkPath, true)
        expect(result).toBe(false)
    })

    it('should return false for a regular file', async () => {
        const result = await isSymlink(tempFilePath)
        expect(result).toBe(false)
    })

    it('should return false for a directory', async () => {
        const result = await isSymlink(tempDirPath)
        expect(result).toBe(false)
    })
})
