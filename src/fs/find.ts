import { basename, dirname, isAbsolute, join, parse } from 'node:path'
import { cwd as CWD } from 'src/constants'
import { PathExistsState } from 'src/types/enums'
import { InvalidPathTypeError, PathNotFoundError } from '../errors'
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
    switch (await pathExists(fullPath)) {
        case PathExistsState.Dir:
        case PathExistsState.File:
            return fullPath
        case PathExistsState.None:
            return await findUp(fullPath, dir)
        case PathExistsState.Unknown:
            throw new InvalidPathTypeError(fullPath)
    }
}

async function findUp(fullPath: string, dir?: boolean): Promise<string> {
    const root = parse(fullPath).root
    const fileName = basename(fullPath)
    const checkState = dir ? PathExistsState.Dir : PathExistsState.File
    let state: PathExistsState = PathExistsState.None
    let path = fullPath
    while (path !== root && state !== checkState) {
        path = dirname(path)
        state = await pathExists(join(path, fileName))
        if (state === PathExistsState.Unknown) throw new InvalidPathTypeError(fullPath)
    }
    if (state === PathExistsState.None) throw new PathNotFoundError(fullPath)
    return join(path, fileName)
}
