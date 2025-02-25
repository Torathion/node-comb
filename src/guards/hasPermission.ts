import { access } from 'node:fs/promises'
import type { FilePermissions } from 'src/types'
import type { Values } from 'typestar'

/**
 *  Check to determine if a file exists with the given permissions.
 *
 *  @param path - the absolute path to the file.
 *  @param permission - the permission to check for as well.
 *  @returns `true`, if the file was found, otherwise `false`.
 */
export default async function hasPermission(path: string, permission: Values<FilePermissions>): Promise<boolean> {
    try {
        await access(path, permission)
        return true
    } catch {
        return false
    }
}
