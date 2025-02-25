import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import { find, PathNotFoundError } from '../../src' // Adjust path as needed
import { createTempDir, cleanupDir, createTempFile } from 'test/test-utils'
import { mkdir } from 'node:fs/promises'

const packageFolder = process.cwd()
const currentFolder = dirname(fileURLToPath(import.meta.url))

describe('find', () => {
    const tempDir = join(currentFolder, 'temp')

    beforeAll(async () => {
        await createTempDir(tempDir)
    })

    afterAll(async () => {
        await cleanupDir(tempDir)
    })

    // Existing tests updated
    it('finds a direct child file with relative path', async () => {
        expect(await find('package.json')).toBe(join(packageFolder, 'package.json'))
    })

    it('finds a direct child directory with relative path', async () => {
        expect(await find('test', true)).toBe(join(packageFolder, 'test'))
    })

    it('finds a direct child file from custom cwd', async () => {
        expect(await find('find.test.ts', false, currentFolder)).toBe(join(currentFolder, 'find.test.ts'))
    })

    it('finds a direct child directory from custom cwd', async () => {
        expect(await find('guards', true, dirname(currentFolder))).toBe(join(packageFolder, 'test', 'guards'))
    })

    it('finds a distant file from custom cwd', async () => {
        expect(await find('package.json', false, currentFolder)).toBe(join(packageFolder, 'package.json'))
    })

    it('finds a distant directory from custom cwd', async () => {
        expect(await find('src', true, currentFolder)).toBe(join(packageFolder, 'src'))
    })

    // New tests for full coverage
    it('returns absolute path if provided and exists as file', async () => {
        const absPath = join(tempDir, 'testfile.txt')
        await createTempFile(absPath, 'test')
        expect(await find(absPath)).toBe(absPath)
    })

    it('returns absolute path if provided and exists as directory', async () => {
        const absDir = join(tempDir, 'testdir')
        await mkdir(absDir)
        expect(await find(absDir, true)).toBe(absDir)
    })

    it('throws PathNotFoundError when file not found up to root', async () => {
        const nonExistent = join(tempDir, 'nonexistent.txt')
        await expect(find(nonExistent)).rejects.toThrow(PathNotFoundError)
    })

    it('throws PathNotFoundError when directory not found up to root', async () => {
        const nonExistentDir = join(tempDir, 'nonexistentDir')
        await expect(find(nonExistentDir, true)).rejects.toThrow(PathNotFoundError)
    })

    it('finds file upward from nested path', async () => {
        const nestedDir = join(tempDir, 'nested', 'deep')
        await mkdir(nestedDir, { recursive: true })
        const targetFile = join(tempDir, 'target.txt')
        await createTempFile(targetFile, 'content')
        expect(await find('target.txt', false, nestedDir)).toBe(targetFile)
    })

    it('finds directory upward from nested path', async () => {
        const nestedDir = join(tempDir, 'nested', 'deep')
        await mkdir(nestedDir, { recursive: true })
        const targetDir = join(tempDir, 'target')
        await mkdir(targetDir)
        expect(await find('target', true, nestedDir)).toBe(targetDir)
    })

    it('stops at root when searching up', async () => {
        const nonExistent = 'nonexistent-root-file.txt'
        await expect(find(nonExistent, false, tempDir)).rejects.toThrow(PathNotFoundError)
    })
})
