import { type FileHandle, open } from 'node:fs/promises'

/**
 *  Wrapper to safely open a file. Silently errors out, if the file not found.
 *
 *  @param path - the path to the file.
 *  @param flags - The normal supported file system flags.
 *  @returns - Either the file handle of the given path or undefined.
 */
export default async function safeGetFileHandle(path: string, flags: string): Promise<FileHandle | undefined> {
    try {
        return await open(path, flags)
    } catch {
        return undefined
    }
}
