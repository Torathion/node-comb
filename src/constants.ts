import { constants } from 'node:fs/promises'

import type { FilePermissions } from './types'

/**
 *  Cached constant of `process.cwd()`. It is very unlikely this will be incorrect.
 */
export const cwd = process.cwd()

export const Permissions: FilePermissions = {
    All: constants.X_OK | constants.F_OK | constants.R_OK | constants.W_OK,
    Exec: constants.X_OK,
    Exists: constants.F_OK,
    Read: constants.R_OK,
    Write: constants.W_OK
}

export const Chmod = {
    All: 0o777,
    Locked: 0o000,
    Readonly: 0o444,
    Writeable: 0o555
}

export const PathExistsCode = {
    Dir: 'd',
    File: '-',
    Link: 'l',
    Socket: 's',
    Unknown: ''
}

export { stripVTControlCharacters as stripAnsi } from 'node:util'
