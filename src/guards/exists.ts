import { Permissions } from 'src/constants'
import hasPermission from './hasPermission'

/**
 *  Checks if a specific endpoint of a given path exists.
 *
 * @param path - target path.
 * @returns `true`, if the endpoint exists, otherwise `false`.
 */
export default async function exists(path: string): Promise<boolean> {
    return await hasPermission(path, Permissions.Exists)
}
