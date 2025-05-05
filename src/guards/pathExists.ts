import { stat } from 'node:fs/promises'
import { FSEntity, Permissions } from 'src/constants'
import hasPermission from './hasPermission'

/**
 *  Multi-variable check to determine if a path exists.
 *
 * @param path - The absolute path to either a directory or file.
 * @returns `0`, if the path was not found, `1`, if the path points to a file, `2`, if the path points to a directory, otherwise `3`.
 */
export default async function pathExists(path: string): Promise<string> {
    try {
        if (!(await hasPermission(path, Permissions.Exists))) return FSEntity.Unknown
        const stats = await stat(path)
        if (stats.isSymbolicLink()) return FSEntity.Link
        if (stats.isDirectory()) return FSEntity.Dir
        if (stats.isSocket()) return FSEntity.Socket
        return stats.isFile() ? FSEntity.File : FSEntity.Unknown
    } catch {
        return FSEntity.Unknown
    }
}
