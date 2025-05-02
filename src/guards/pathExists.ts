import { stat } from 'node:fs/promises'
import { PathExistsCode , Permissions } from 'src/constants'
import hasPermission from './hasPermission'

/**
 *  Multi-variable check to determine if a path exists.
 *
 * @param path - The absolute path to either a directory or file.
 * @returns `0`, if the path was not found, `1`, if the path points to a file, `2`, if the path points to a directory, otherwise `3`.
 */
export default async function pathExists(path: string): Promise<string> {
    try {
        if (!(await hasPermission(path, Permissions.Exists))) return PathExistsCode.Unknown
        const stats = await stat(path)
        if (stats.isSymbolicLink()) return PathExistsCode.Link
        if (stats.isDirectory()) return PathExistsCode.Dir
        if (stats.isSocket()) return PathExistsCode.Socket
        return stats.isFile() ? PathExistsCode.File : PathExistsCode.Unknown
    } catch {
        return PathExistsCode.Unknown
    }
}
