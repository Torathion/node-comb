import clearLastLogLine from 'src/std/clearLastLogLine'
import { mockStd } from 'test/test-utils'
import { describe, it, expect, vi, afterEach, beforeEach, type MockInstance } from 'vitest'

// Assuming `escape` is defined somewhere in your codebase
const escape = '\x1B[' // ANSI escape sequence prefix, adjust if different in your code

describe('clearLastLogLine', () => {
    // Spy on process.stdout.write before each test
    let stdoutWriteSpy: MockInstance<typeof process.stdout.write & ((chunk: string) => boolean)>

    beforeEach(() => {
        stdoutWriteSpy = mockStd(process.stdout)
    })

    afterEach(() => {
        vi.restoreAllMocks() // Clean up spies after each test
    })

    it('writes correct ANSI sequences to clear the last line', () => {
        clearLastLogLine()

        // Check the two expected writes
        expect(stdoutWriteSpy).toHaveBeenCalledTimes(2)
        expect(stdoutWriteSpy).toHaveBeenNthCalledWith(1, `${escape}A`)
        expect(stdoutWriteSpy).toHaveBeenNthCalledWith(2, `${escape}K`)
    })

    it('does not throw errors when called multiple times', () => {
        expect(() => {
            clearLastLogLine()
            clearLastLogLine()
        }).not.toThrow()

        expect(stdoutWriteSpy).toHaveBeenCalledTimes(4) // 2 calls x 2 writes each
    })

    it('writes sequences in correct order', () => {
        clearLastLogLine()

        const calls = stdoutWriteSpy.mock.calls
        expect(calls.length).toBe(2)
        expect(calls[0][0]).toBe(`${escape}A`) // Move up one line
        expect(calls[1][0]).toBe(`${escape}K`) // Clear line from cursor to end
    })
})
