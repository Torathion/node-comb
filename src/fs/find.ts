import { basename, dirname, isAbsolute, join, parse } from 'node:path'
import { cwd as CWD, FSEntity } from 'src/constants'
import { PathNotFoundError } from '../errors'
import pathExists from '../guards/pathExists'

/**
 *  Searches for the endpoint of the path, no matter the type. If it can't find the endpoint in the given current working directory, it will
 *  traverse the filesystem up.
 *
 * @param path - target path or name of the endpoint.
 * @param dir - flag indicating whether the endpoint is a directory or not.
 * @param cwd - current work directory to start searching from.
 * @returns the absolute path of the found endpoint.
 */
export default async function find(path: string, dir?: boolean, cwd = CWD): Promise<string> {
    const fullPath = isAbsolute(path) ? path : join(cwd, path)
    return (await pathExists(fullPath)) === FSEntity.Unknown ? await findUp(fullPath, dir) : fullPath
}

async function findUp(fullPath: string, dir?: boolean): Promise<string> {
    const root = parse(fullPath).root
    const fileName = basename(fullPath)
    const checkState = dir ? FSEntity.Dir : FSEntity.File
    let state: string = FSEntity.Unknown
    let path = fullPath
    while (path !== root && state !== checkState) {
        path = dirname(path)
        state = await pathExists(join(path, fileName))
    }
    if (state === FSEntity.Unknown) throw new PathNotFoundError(fullPath)
    return join(path, fileName)
}
