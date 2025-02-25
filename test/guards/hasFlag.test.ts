import { describe, expect, it } from 'vitest'
import { hasFlag } from '../../src/guards'

describe('hasFlag', () => {
    it('works', () => {
        expect(hasFlag('bbb', ['--aaa', '--bbb', '--ccc'])).toBe(true)
        expect(hasFlag('--bbb', ['--aaa', '--bbb', '--ccc']), 'optional prefix').toBe(true)
        expect(hasFlag('command=b', ['--aaa', '--command=b', '--ccc'])).toBe(true)
        expect(hasFlag('aaa', ['--aaa', '--', '--bbb'])).toBe(true)
        expect(hasFlag('bbb', ['--aaa', '--', '--bbb']), "don't match flags after terminator").toBe(false)
        expect(hasFlag('aaa', ['--bbb'])).toBe(false)
        expect(hasFlag('-u', ['-f', '-u', '-b'])).toBe(true)
        expect(hasFlag('-u', ['-u', '--', '-f'])).toBe(true)
        expect(hasFlag('u', ['-f', '-u', '-b'])).toBe(true)
        expect(hasFlag('u', ['-u', '--', '-f'])).toBe(true)
        expect(hasFlag('f', ['-u', '--', '-f'])).toBe(false)
    })
})
