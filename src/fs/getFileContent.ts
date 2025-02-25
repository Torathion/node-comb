import type { FileHandle } from 'node:fs/promises'

/**
 *  Extracts the content of a file from a handle.
 *
 *  @param handle - target file handle.
 *  @param close - flag indicating whether to also close the file handle when done extracting.
 *  @returns the extracted file content.
 */
export default async function getFileContent(handle: FileHandle, close?: boolean): Promise<string> {
    const string = (await handle.readFile()).toString()
    if (close) await handle.close()
    return string
}
