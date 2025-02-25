import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { isDir } from '../../src/guards'

const packageFolder = process.cwd()
const currentFolder = dirname(fileURLToPath(import.meta.url))

describe('isDir', () => {
    it('works', () => {
        expect(isDir(currentFolder)).toBe(true)
        expect(isDir(packageFolder)).toBe(true)
        expect(isDir(import.meta.url)).toBe(false)
        expect(isDir('')).toBe(false)
        expect(isDir(resolve(currentFolder, '..', 'fixtures/simple-dir'))).toBe(true)
    })
})
