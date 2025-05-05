import { writeFile } from 'fs/promises'
import { dirname, join } from 'path'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { readLines } from '../../src'
import { cleanupDir, createTempDir } from '../test-utils'
import { fileURLToPath } from 'url'

describe('readLines', () => {
    const currentFolder = dirname(fileURLToPath(import.meta.url))
    const tempDir = join(currentFolder, 'temp-readFile')

    // Set up temporary directory before each test
    beforeAll(async () => {
        await createTempDir(tempDir)
    })

    // Clean up temporary directory after each test
    afterAll(async () => {
        await cleanupDir(tempDir)
    })

    // Helper function to create a temporary file and return its path
    async function createTempFile(fileName: string, content: string): Promise<string> {
        const filePath = join(tempDir, fileName)
        await writeFile(filePath, content)
        return filePath
    }

    // Helper function to collect all lines from the generator
    async function collectLines(filePath: string): Promise<string[]> {
        const lines: string[] = []
        for await (const line of readLines(filePath)) {
            lines.push(line)
        }
        return lines
    }

    it('should read a file with normal newlines', async () => {
        const filePath = await createTempFile('normal.txt', 'Line 1\nLine 2\nLine 3\n')
        const lines = await collectLines(filePath)
        expect(lines).toEqual(['Line 1', 'Line 2', 'Line 3'])
    })

    it('should read a file with no trailing newline', async () => {
        const filePath = await createTempFile('no-newline.txt', 'Line 1\nLine 2\nLine 3')
        const lines = await collectLines(filePath)
        expect(lines).toEqual(['Line 1', 'Line 2', 'Line 3'])
    })

    it('should handle an empty file', async () => {
        const filePath = await createTempFile('empty.txt', '')
        const lines = await collectLines(filePath)
        expect(lines).toEqual([])
    })

    it('should read a single-line file', async () => {
        const filePath = await createTempFile('single-line.txt', 'Single line')
        const lines = await collectLines(filePath)
        expect(lines).toEqual(['Single line'])
    })

    it('should handle multiple newlines', async () => {
        const filePath = await createTempFile('multiple-newlines.txt', 'Line 1\nLine 2\n\nLine 3\n\n')
        const lines = await collectLines(filePath)
        expect(lines).toEqual(['Line 1', 'Line 2', '', 'Line 3', ''])
    })

    it('should handle a large file with many lines', async () => {
        // Generate a file with 1000 lines
        const content = Array.from({ length: 1000 }, (_, i) => `Line ${i + 1}`).join('\n') + '\n'
        const filePath = await createTempFile('large.txt', content)
        const lines = await collectLines(filePath)
        expect(lines.length).toBe(1000)
        expect(lines[0]).toBe('Line 1')
        expect(lines[999]).toBe('Line 1000')
    })

    it('should handle a large file to verify leftover logic (no trailing newline)', async () => {
        // Generate a file with 100,000 lines, no trailing newline
        const numLines = 100_000
        const content = Array.from({ length: numLines }, (_, i) => `Line ${i + 1}`).join('\n')
        const filePath = await createTempFile('large-no-newline.txt', content)
        const lines = await collectLines(filePath)

        expect(lines.length).toBe(numLines)
        expect(lines[0]).toBe('Line 1')
        expect(lines[numLines - 1]).toBe(`Line ${numLines}`) // Verify last line (leftover)
    })

    it('should handle a large file to verify leftover logic (with trailing newline)', async () => {
        // Generate a file with 100,000 lines, with trailing newline
        const numLines = 100_000
        const content = Array.from({ length: numLines }, (_, i) => `Line ${i + 1}`).join('\n') + '\n'
        const filePath = await createTempFile('large-with-newline.txt', content)
        const lines = await collectLines(filePath)

        expect(lines.length).toBe(numLines)
        expect(lines[0]).toBe('Line 1')
        expect(lines[numLines - 1]).toBe(`Line ${numLines}`) // Verify last line
    })

    it('should handle a large file with long lines to verify leftover logic (with trailing newline)', async () => {
        // Generate a file with 1,000 long lines (~10KB each), with trailing newline
        const numLines = 1_000
        const lineLength = 10_000 // ~10KB per line
        const longLine = 'x'.repeat(lineLength - 10) + 'last-10-chars'
        const content = Array.from({ length: numLines }, (_, i) => `Line ${i + 1} ${longLine}`).join('\n') + '\n'
        const filePath = await createTempFile('large-long-lines-with-newline.txt', content)
        const lines = await collectLines(filePath)

        expect(lines.length).toBe(numLines)
        expect(lines[0]).toBe(`Line 1 ${longLine}`)
        expect(lines[numLines - 3]).toBe(`Line ${numLines - 2} ${longLine}`) // Verify last line
    })

    it('should throw an error for a non-existent file', async () => {
        await expect(collectLines(join(tempDir, 'non-existent.txt'))).rejects.toThrow()
    })
})
