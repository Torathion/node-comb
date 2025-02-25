import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { Chmod, hasPermission, Permissions } from '../../src'
import { cleanup, cleanupDir, createTempDir, createTempFile } from '../test-utils'

const content = 'test content'
// In windows, files are ALWAYS executable
const isWin = process.platform === 'win32'

describe('hasPermission', () => {
    const tempDir = path.join(dirname(fileURLToPath(import.meta.url)), 'temp-hasPermission')
    const tempFilePath = path.join(tempDir, 'testfile.txt')
    const nonExistentPath = path.join(tempDir, 'nonexistent.txt')

    beforeAll(async () => {
        // Create a temporary directory for tests
        await createTempDir(tempDir)
    })

    afterEach(async () => {
        await cleanup(tempFilePath)
    })

    afterAll(async () => {
        // Clean up the temporary directory after all tests
        await cleanup(tempFilePath)
        await cleanupDir(tempDir)
    })
    it('should return true if the file exists and has the required permissions', async () => {
        // Create a file with read permissions
        await createTempFile(tempFilePath, content, 0o644)

        // Check for read permission
        expect(await hasPermission(tempFilePath, Permissions.Read)).toBe(true)
    })
    it('should return false if the file exists but lacks the required permissions', async () => {
        // Create a file and remove all permissions
        await createTempFile(tempFilePath, content, Chmod.Locked)

        // Check for read permission
        expect(await hasPermission(tempFilePath, Permissions.Read)).toBe(isWin)
    })
    it('should return false if the file does not exist', async () => {
        expect(await hasPermission(nonExistentPath, Permissions.Read)).toBe(false)
    })
    it('should return true if the file exists and has execute permission', async () => {
        // Create a file with execute permissions
        await createTempFile(tempFilePath, content, 0o755)

        // Check for execute permission
        expect(await hasPermission(tempFilePath, Permissions.Exec)).toBe(true)
    })
    it('should return false if the file exists but lacks execute permission', async () => {
        // Create a file without execute permissions
        await createTempFile(tempFilePath, content, 0o644)

        // Check for execute permission
        expect(await hasPermission(tempFilePath, Permissions.Exec)).toBe(isWin)
    })
    it('should return true if the file exists and has write permission', async () => {
        // Create a file with write permissions for owner
        await createTempFile(tempFilePath, content, 0o644)

        // Check for write permission
        expect(await hasPermission(tempFilePath, Permissions.Write)).toBe(true)
    })
    it('should return false if the file exists but lacks write permission', async () => {
        // Create a file without write permissions
        await createTempFile(tempFilePath, content, Chmod.Readonly)

        // Check for write permission
        expect(await hasPermission(tempFilePath, Permissions.Write)).toBe(false)
    })
    it('should return true if the file exists and has all permissions', async () => {
        // Create a file with all permissions
        await createTempFile(tempFilePath, content, Chmod.All)

        // Check for all permissions
        expect(await hasPermission(tempFilePath, Permissions.All)).toBe(true)
    })
    it('should return false if the file exists but lacks all permissions', async () => {
        // Create a file without any permissions
        await createTempFile(tempFilePath, content, Chmod.Locked)

        // Check for all permissions
        expect(await hasPermission(tempFilePath, Permissions.All)).toBe(false)
    })
})
