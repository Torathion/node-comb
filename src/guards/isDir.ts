import { extname } from 'node:path'

/**
 *  Checks if the given path resembles a directory path.
 *
 * @param path - target path.
 * @returns `true`, if the path pattern resembles a directory, otherwise `false`.
 */
export default function isDir(path: string): boolean {
    if (!path) return false
    return path[path.length - 1] === '/' || !extname(path)
}
