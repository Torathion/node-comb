import readFile from 'src/fs/readFile'

/**
 *  Checks if a target file contains the target content.
 *
 * @param path - absolute path to the target file.
 * @param content - content to contain.
 * @returns `true`, if the file contains said content, otherwise `false`.
 */
export default async function hasFileContent(path: string, content: string): Promise<boolean> {
    try {
        return content ? (await readFile(path)).toLowerCase().includes(content.toLowerCase()) : false
    } catch {
        return false
    }
}
