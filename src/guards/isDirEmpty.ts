import { readdir } from 'node:fs/promises'
import { InvalidDirectoryPathError } from 'src/errors'

/**
 *  Check to determine if a directory is empty.
 *
 *  @remarks
 *  It can error out a `InvalidDirectoryPathError`, if the given path does not point to a directory.
 *
 * @param path - The absolute path to the directory.
 * @returns `true`, if the directory is empty, otherwise `false`.
 */
export default async function isDirEmpty(path: string): Promise<boolean> {
    try {
        return !(await readdir(path)).length
    } catch {
        throw new InvalidDirectoryPathError(path)
    }
}
