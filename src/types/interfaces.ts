import type { constants } from 'node:fs/promises'
/**
 *  NodeJS token of `utils.parseArgs`.
 */
export interface ArgToken {
    index: number
    inlineValue?: boolean
    kind: 'option-terminator' | 'option' | 'positional'
    name: string
    rawName: string
    value?: string
}

export interface CLISchemaObject {
    [x: string]: (boolean | string)[] | boolean | string | undefined
    silent?: boolean
}

/**
 *  Interface of `Permissions` holding the types of each file permission constant.
 */
export interface FilePermissions {
    All: typeof constants.X_OK
    Exec: typeof constants.X_OK
    Exists: typeof constants.F_OK
    Read: typeof constants.R_OK
    Write: typeof constants.W_OK
}

export interface FileSizeable {
    size: string
}

/**
 *  Error extension including a `code` property.
 */
export interface FileSystemError extends Error {
    code: string
}

/**
 *  Parsed arguments of NodeJS's `utils.parseArguments`.
 */
export interface ParsedArgs<S extends object> {
    positionals: unknown[]
    tokens: ArgToken[]
    values: S
}
