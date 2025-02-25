import log from 'src/std/log'
import { mockStd } from 'test/test-utils'
import { describe, beforeEach, afterEach, vi, it, expect, type MockInstance } from 'vitest'

describe('log', () => {
    let stdoutWriteSpy: MockInstance<typeof process.stdout.write & ((chunk: string) => boolean)>

    beforeEach(() => {
        stdoutWriteSpy = mockStd(process.stdout)
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('writes string with newlines to stdout', () => {
        const input = 'Hello, world!'
        log(input)

        expect(stdoutWriteSpy).toHaveBeenCalledTimes(1)
        expect(stdoutWriteSpy).toHaveBeenCalledWith(Buffer.from(`\n${input}\n`))
    })

    it('writes empty string with newlines to stdout', () => {
        const input = ''
        log(input)

        expect(stdoutWriteSpy).toHaveBeenCalledTimes(1)
        expect(stdoutWriteSpy).toHaveBeenCalledWith(Buffer.from('\n\n'))
    })

    it('does not throw when called multiple times', () => {
        const input1 = 'First message'
        const input2 = 'Second message'

        expect(() => {
            log(input1)
            log(input2)
        }).not.toThrow()

        expect(stdoutWriteSpy).toHaveBeenCalledTimes(2)
        expect(stdoutWriteSpy).toHaveBeenNthCalledWith(1, Buffer.from(`\n${input1}\n`))
        expect(stdoutWriteSpy).toHaveBeenNthCalledWith(2, Buffer.from(`\n${input2}\n`))
    })

    it('writes Buffer instance to stdout', () => {
        const input = 'Buffer test'
        log(input)

        const callArg = stdoutWriteSpy.mock.calls[0][0]
        expect(callArg).toBeInstanceOf(Buffer)
        expect(callArg.toString()).toBe(`\n${input}\n`)
    })

    it('handles special characters in string', () => {
        const input = 'Special chars: © é ñ 😊'
        log(input)

        expect(stdoutWriteSpy).toHaveBeenCalledTimes(1)
        expect(stdoutWriteSpy).toHaveBeenCalledWith(Buffer.from(`\n${input}\n`))
        expect(stdoutWriteSpy.mock.calls[0][0].toString()).toBe(`\n${input}\n`)
    })
})
