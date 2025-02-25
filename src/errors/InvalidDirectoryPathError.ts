export default class InvalidDirectoryPathError extends Error {
    readonly path: string

    constructor(path: string) {
        super(`The path "${path}" is not a directory.`)
        this.name = 'InvalidDirectoryPathError'
        this.path = path
    }
}
