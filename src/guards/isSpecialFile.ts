import type { Stats } from 'node:fs'

/**
 *  Guard function taking in file path stats to check if the target is a non-conventional file (socket, pipe, device...).
 *
 * @param stats - stats of the path.
 * @returns `true`, if the path points to a special file, otherwise `false`.
 */
export default function isSpecialFile(stats: Stats): boolean {
    return stats.isBlockDevice() || stats.isCharacterDevice() || stats.isFIFO() || stats.isSocket()
}
