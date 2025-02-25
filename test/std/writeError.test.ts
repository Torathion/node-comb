import { writeError } from 'src'
import { mockStd } from 'test/test-utils'
import { describe, beforeEach, afterEach, vi, it, expect, type MockInstance } from 'vitest'

describe('writeError', () => {
    let stderrWriteSpy: MockInstance<typeof process.stderr.write & ((chunk: string) => boolean)>

    beforeEach(() => {
        stderrWriteSpy = mockStd(process.stderr)
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('writes error stack with newlines to stderr', () => {
        const error = new Error('Test error')
        writeError(error)

        expect(stderrWriteSpy).toHaveBeenCalledTimes(1)
        expect(stderrWriteSpy).toHaveBeenCalledWith(Buffer.from(`\n${error.stack!}\n`))
    })

    it('handles error with no stack gracefully', () => {
        const error = new Error('No stack error')
        delete error.stack

        writeError(error)

        expect(stderrWriteSpy).toHaveBeenCalledTimes(1)
        expect(stderrWriteSpy).toHaveBeenCalledWith(Buffer.from('\nundefined\n'))
    })

    it('does not throw when called multiple times', () => {
        const error1 = new Error('First error')
        const error2 = new Error('Second error')

        expect(() => {
            writeError(error1)
            writeError(error2)
        }).not.toThrow()

        expect(stderrWriteSpy).toHaveBeenCalledTimes(2)
        expect(stderrWriteSpy).toHaveBeenNthCalledWith(1, Buffer.from(`\n${error1.stack!}\n`))
        expect(stderrWriteSpy).toHaveBeenNthCalledWith(2, Buffer.from(`\n${error2.stack!}\n`))
    })

    it('writes Buffer instance to stderr', () => {
        const error = new Error('Buffer test')
        writeError(error)

        const callArg = stderrWriteSpy.mock.calls[0][0]
        expect(callArg).toBeInstanceOf(Buffer)
        expect(callArg.toString()).toBe(`\n${error.stack!}\n`)
    })
})
