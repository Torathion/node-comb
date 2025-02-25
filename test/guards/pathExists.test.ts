import { symlink } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { pathExists } from '../../src'
import { PathExistsState } from '../../src/types/enums'
import { cleanup, cleanupDir, createTempDir, createTempFile } from '../test-utils'
import { fileURLToPath } from 'node:url'

describe('pathExists', () => {
    const tempDir = join(dirname(fileURLToPath(import.meta.url)), 'temp-pathExists')
    const tempFilePath = join(tempDir, 'testfile.txt')
    const tempDirPath = join(tempDir, 'testdir')
    const nonExistentPath = join(tempDir, 'nonexistent')

    beforeAll(async () => {
        // Create a temporary directory for tests
        await createTempDir(tempDir)
    })

    afterAll(async () => {
        // Clean up the temporary directory after all tests
        await cleanup(tempFilePath)
        await cleanupDir(tempDirPath)
        await cleanupDir(tempDir)
    })

    it('should return 0 for a non-existent path', async () => {
        expect(await pathExists(nonExistentPath)).toBe(PathExistsState.None)
    })

    it('should return 1 for a file', async () => {
        await createTempFile(tempFilePath, 'test content')
        expect(await pathExists(tempFilePath)).toBe(PathExistsState.File)
    })

    it('should return 2 for a directory', async () => {
        await createTempDir(tempDirPath)
        expect(await pathExists(tempDirPath)).toBe(PathExistsState.Dir)
    })

    it('should return 0 for a broken symbolic link', async () => {
        const symlinkPath = join(tempDir, 'broken-symlink')
        await symlink(nonExistentPath, symlinkPath)

        expect(await pathExists(symlinkPath)).toBe(PathExistsState.None)

        // Clean up the symbolic link
        await cleanup(symlinkPath)
    })

    it('should return 1 for a valid symbolic link to a file', async () => {
        await createTempFile(tempFilePath, 'test content')
        const symlinkPath = join(tempDir, 'valid-symlink')
        await symlink(tempFilePath, symlinkPath)

        const result = await pathExists(symlinkPath)
        expect(result).toBe(PathExistsState.File)

        // Clean up the symbolic link
        await cleanup(symlinkPath)
    })

    it('should return 2 for a valid symbolic link to a directory', async () => {
        await createTempDir(tempDirPath)
        const symlinkPath = join(tempDir, 'valid-symlink-dir')
        await symlink(tempDirPath, symlinkPath)

        expect(await pathExists(symlinkPath)).toBe(PathExistsState.Dir)

        // Clean up the symbolic link
        await cleanup(symlinkPath)
    })
})
