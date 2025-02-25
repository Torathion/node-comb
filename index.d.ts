import { constants } from 'node:fs/promises'
import type { Stats } from 'fs'
import type { FileHandle } from 'fs/promises'
import type { Values } from 'typestar'

declare module 'node-comb' {
    /**
     *  States of `pathExists`.
     */
    export const enum PathExistsState {
        /**
         * Path does not exist.
         */
        None,
        /**
         * Path exists and is a file.
         */
        File,
        /**
         * Path exists and is a directory.
         */
        Dir,
        /**
         * Path exists, but is neither a file nor a directory
         */
        Unknown
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
    /**
     *  String narrowing type of file error codes.
     */
    export type FileError = 'ENOENT' | 'EACCES' | 'EPERM'
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
    /**
     *  Cached constant of `process.cwd()`. It is very unlikely this will be incorrect.
     */
    export const cwd
    /**
     *  Writes an error to stderr using low level functions.
     *
     *  @param outStream the error to write.
     */
    export function writeError(outStream: Error): void
    /**
     *  Writes a string to stdout using low level functions.
     *
     *  @param outStream the string to write.
     */
    export function log(outStream: string): void
    /**
     *  Clears the last line of stdout by using low level write commands.
     */
    export function clearLastLogLine(): void
    /**
     *  Runs a CLI command as a promise.
     *
     *  @param commandString - text representing a cli command.
     *  @returns the output of said command.
     */
    export function runCommand(commandString: string): Promise<{ stderr: string; stdout: string }>
    /**
     *  Checks if the current process contains the requested flag.
     *
     *  @param flag - flag to search for
     *  @param argv - the arguments of the process
     *  @returns true if a process contains the flag, otherwise false
     */
    export function hasFlag(flag: string, argv?: string[]): boolean
    /**
     *  Check to determine if a file exists with the given permissions.
     *
     *  @param path - the absolute path to the file.
     *  @param permission - the permission to check for as well.
     *  @returns `true`, if the file was found, otherwise `false`.
     */
    export function hasPermission(path: string, permission: Values<FilePermissions>): Promise<boolean>
    /**
     *  Checks if the given path resembles a directory path.
     *
     * @param path - target path.
     * @returns `true`, if the path pattern resembles a directory, otherwise `false`.
     */
    export function isDir(path: string): boolean
    /**
     *  Check to determine if a directory is empty.
     *
     *  @remarks
     *  It can error out a `InvalidDirectoryPathError`, if the given path does not point to a directory.
     *
     * @param path - The absolute path to the directory.
     * @returns `true`, if the directory is empty, otherwise `false`.
     */
    export function isDirEmpty(path: string): Promise<boolean>
    /**
     * Narrows the type of a string to a `FileError`.
     *
     * @param errorCode - error code of the target error
     * @returns `true`, if the error is a `FileError`, otherwise `false`.
     */
    export function isFileError(errorCode: string): errorCode is FileError
    /**
     *  Guard function taking in file path stats to check if the target is a non-conventional file (socket, pipe, device...).
     *
     * @param stats - stats of the path.
     * @returns `true`, if the path points to a special file, otherwise `false`.
     */
    export function isSpecialFile(stats: Stats): boolean
    /**
     *  Checks if the given path points to a functional symbolic link to an actual file.
     *
     * @param path - target path.
     * @returns `true`, if the path points to a functional symlink, otherwise `false`.
     */
    export function isSymlink(path: string, checkValidity?: boolean): Promise<boolean>
    /**
     *  Multi-variable check to determine if a path exists.
     *
     * @param path - The absolute path to either a directory or file.
     * @returns `0`, if the path was not found, `1`, if the path points to a file, `2`, if the path points to a directory, otherwise `3`.
     */
    export function pathExists(path: string): Promise<PathExistsState>
    /**
     *  Checks if a file exists and ensures it exists before writing.
     *
     * @param path - target path to the file.
     * @param content - the content to write into the target file.
     */
    export function ensureFile(path: string, content?: string): Promise<void>
    /**
     *  Searches for the endpoint of the path, no matter the type. If it can't find the endpoint in the given current working directory, it will
     *  traverse the filesystem up.
     *
     * @param path - target path or name of the endpoint.
     * @param dir - flag indicating whether the endpoint is a directory or not.
     * @param cwd - current work directory to start searching from.
     * @returns the absolute path of the found endpoint.
     */
    export function find(path: string, dir?: boolean, cwd?: string): Promise<string>
    /**
     *  Extracts the content of a file from a handle.
     *
     *  @param handle - target file handle.
     *  @param close - flag indicating whether to also close the file handle when done extracting.
     *  @returns the extracted file content.
     */
    export function getFileContent(handle: FileHandle, close?: boolean): Promise<string>
    /**
     *  Reads a file and extracts its file content.
     *
     *  @param path - absolute path to the target file.
     *  @returns the extracted file content.
     */
    export function readFile(path: string): Promise<string>
    /**
     * Replaces a specific line or range of lines in a file using a low-level file handle.
     *
     * @param handle - The file handle to the target file.
     * @param oldContent - The current, previously read, content of the file.
     * @param newContent - The new content to write to the file.
     * @param startLine - The starting line number where the replacement should begin.
     * @param endLine - The ending line number where the replacement should end.
     */
    export function replaceFileContent(handle: FileHandle, oldContent: string, newContent: string, start: number, end?: number): Promise<void>
    /**
     *  Wrapper to safely open a file. Silently errors out, if the file not found.
     *
     *  @param path - the path to the file.
     *  @param flags - The normal supported file system flags.
     *  @returns - Either the file handle of the given path or undefined.
     */
    export function safeGetFileHandle(path: string, flags: string): Promise<FileHandle | undefined>
    /**
     *  Checks if a target file contains the target content.
     *
     * @param path - absolute path to the target file.
     * @param content - content to contain.
     * @returns `true`, if the file contains said content, otherwise `false`.
     */
    export function hasFileContent(path: string, content: string): Promise<boolean>
    /**
     *  Checks if a specific endpoint of a given path exists.
     *
     * @param path - target path.
     * @returns `true`, if the endpoint exists, otherwise `false`.
     */
    export function exists(path: string): Promise<boolean>
}
