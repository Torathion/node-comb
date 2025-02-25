import { stat } from 'node:fs/promises'
import type { PathExistsState } from 'src/types'
import { Permissions } from 'src/constants'
import hasPermission from './hasPermission'

/**
 *  Multi-variable check to determine if a path exists.
 *
 * @param path - The absolute path to either a directory or file.
 * @returns `0`, if the path was not found, `1`, if the path points to a file, `2`, if the path points to a directory, otherwise `3`.
 */
export default async function pathExists(path: string): Promise<PathExistsState> {
    try {
        if (!(await hasPermission(path, Permissions.Exists))) return 0
        const stats = await stat(path)
        if (stats.isFile()) return 1
        if (stats.isDirectory()) return 2
        return 3
    } catch {
        return 0
    }
}
