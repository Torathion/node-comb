import { join, dirname } from 'node:path'
import { isFileError, type FileSystemError } from 'src'
import { createTempDir, createTempFile, lock, cleanup, cleanupDir } from 'test/test-utils'
import { fileURLToPath } from 'node:url'
import { describe, it, expect, afterAll, beforeAll } from 'vitest'
import { open, unlink } from 'node:fs/promises'

describe('isFileError', () => {
    const tempDir = join(dirname(fileURLToPath(import.meta.url)), 'temp-isFileError')
    const tempFilePath = join(tempDir, 'testfile.txt')
    const nonExistentFilePath = join(tempDir, 'nonexistent-file.txt')
    const lockedFilePath = join(tempDir, 'locked-file.txt')

    beforeAll(async () => {
        // Create a temporary directory for tests
        await createTempDir(tempDir)

        // Create a temporary file
        await createTempFile(tempFilePath, 'test content')

        // Create a locked file (no permissions)
        await createTempFile(lockedFilePath, 'locked content')
        await lock(lockedFilePath)
    })

    afterAll(async () => {
        // Clean up the temporary directory after all tests
        await cleanup(tempFilePath)
        await cleanup(lockedFilePath)
        await cleanupDir(tempDir)
    })

    it('should return true for "ENOENT" (file not found)', async () => {
        try {
            await open(nonExistentFilePath, 'r')
        } catch (error) {
            expect(isFileError((error as FileSystemError).code)).toBe(true)
        }
    })

    it('should return true for "EACCES" (permission denied)', async () => {
        try {
            await open(lockedFilePath, 'r')
        } catch (error) {
            expect(isFileError((error as FileSystemError).code)).toBe(true)
        }
    })

    it('should return true for "EPERM" (operation not permitted)', async () => {
        try {
            // Simulate an operation that requires higher permissions (e.g., deleting a locked file)
            await unlink(lockedFilePath)
        } catch (error) {
            expect(isFileError((error as FileSystemError).code)).toBe(true)
        }
    })

    it('should return true for FileError codes"', () => {
        expect(isFileError('ENOENT')).toBe(true)
        expect(isFileError('EACCES')).toBe(true)
        expect(isFileError('EPERM')).toBe(true)
    })

    it('should return false for non-FileError codes', () => {
        expect(isFileError('ENOTDIR')).toBe(false) // Example of a non-FileError code
        expect(isFileError('EBUSY')).toBe(false) // Example of a non-FileError code
        expect(isFileError('UNKNOWN')).toBe(false) // Example of a non-FileError code
    })

    it('should return false for empty string', () => {
        expect(isFileError('')).toBe(false)
    })

    it('should return false for non-string values', () => {
        // @ts-expect-error - Testing invalid input
        expect(isFileError(null)).toBe(false)
        // @ts-expect-error - Testing invalid input
        expect(isFileError(undefined)).toBe(false)
        // @ts-expect-error - Testing invalid input
        expect(isFileError(123)).toBe(false)
        // @ts-expect-error - Testing invalid input
        expect(isFileError({})).toBe(false)
    })
})
