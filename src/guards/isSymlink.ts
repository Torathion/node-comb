import { lstat, readlink, stat } from 'node:fs/promises'

/**
 *  Checks if the given path points to a functional symbolic link to an actual file.
 *
 * @param path - target path.
 * @returns `true`, if the path points to a functional symlink, otherwise `false`.
 */
export default async function isSymlink(path: string, checkValidity = false): Promise<boolean> {
    try {
        const stats = await lstat(path)
        if (stats.isSymbolicLink()) {
            const target = await readlink(path)
            if (!checkValidity) return true
            try {
                await stat(target)
                return true // Symlink is valid
            } catch {
                return false // Symlink target does not exist
            }
        }
        return false
    } catch {
        return false
    }
}
