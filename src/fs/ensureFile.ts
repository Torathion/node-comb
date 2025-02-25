import { existsSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'

/**
 *  Checks if a file exists and ensures it exists before writing.
 *
 * @param path - target path to the file.
 * @param content - the content to write into the target file.
 */
export default async function ensureFile(path: string, content = ''): Promise<void> {
    if (!existsSync(path)) await writeFile(path, content, 'utf8')
}
