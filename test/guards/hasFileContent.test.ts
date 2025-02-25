import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { Chmod, hasFileContent } from '../../src'
import { cleanupDir, createTempDir, createTempFile, tempFileName } from '../test-utils'

describe('hasFileContent', () => {
    const currentFolder = dirname(fileURLToPath(import.meta.url))
    const tempDir = join(currentFolder, 'temp-hasFileContent')

    beforeAll(async () => {
        await createTempDir(tempDir)
    })

    afterAll(async () => {
        await cleanupDir(tempDir)
    })

    it('returns true if file contains exact content', async () => {
        const path = tempFileName(tempDir)
        const content = 'Hello, world!'
        await createTempFile(path, content)

        expect(await hasFileContent(path, content)).toBe(true)
    })

    it('returns true if file contains content case-insensitively', async () => {
        const path = tempFileName(tempDir)
        await createTempFile(path, 'HELLO, WORLD!')

        expect(await hasFileContent(path, 'Hello, World!')).toBe(true)
    })

    it('returns false if file does not contain content', async () => {
        const path = tempFileName(tempDir)
        await createTempFile(path, 'Hello, world!')

        expect(await hasFileContent(path, 'Goodbye')).toBe(false)
    })

    it('returns false if file does not exist', async () => {
        const path = join(tempDir, 'nonexistent.txt')

        expect(await hasFileContent(path, 'test')).toBe(false)
    })

    it('returns false if readFile throws an error', async () => {
        const path = tempFileName(tempDir)
        await createTempFile(path, 'Some content', Chmod.Locked)

        expect(await hasFileContent(path, 'content')).toBe(false)
    })

    it('returns true for substring match', async () => {
        const path = tempFileName(tempDir)
        await createTempFile(path, 'This is a longer text with some content inside.')

        expect(await hasFileContent(path, 'some content')).toBe(true)
    })

    it('returns false for empty content search in non-empty file', async () => {
        const path = tempFileName(tempDir)
        await createTempFile(path, 'Non-empty content')

        expect(await hasFileContent(path, '')).toBe(false)
    })

    it('returns false for content search in empty file', async () => {
        const path = tempFileName(tempDir)
        await createTempFile(path, '')

        expect(await hasFileContent(path, 'content')).toBe(false)
    })
})
