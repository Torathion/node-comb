import { open } from 'node:fs/promises'
import getFileContent from './getFileContent'

/**
 *  Reads a file and extracts its file content.
 *
 *  @param path - absolute path to the target file.
 *  @returns the extracted file content.
 */
export default async function readFile(path: string): Promise<string> {
    return await getFileContent(await open(path, 'r+'), true)
}
