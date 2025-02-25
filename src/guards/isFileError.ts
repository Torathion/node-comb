import type { FileError } from 'src/types/types'

/**
 * Narrows the type of a string to a `FileError`.
 *
 * @param errorCode - error code of the target error
 * @returns `true`, if the error is a `FileError`, otherwise `false`.
 */
export default function isFileError(errorCode: string): errorCode is FileError {
    return errorCode === 'ENOENT' || errorCode === 'EACCES' || errorCode === 'EPERM'
}
