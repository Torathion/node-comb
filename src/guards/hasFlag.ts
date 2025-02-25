/**
 *  Checks if the current process contains the requested flag.
 *
 *  @param flag - flag to search for
 *  @param argv - the arguments of the process
 *  @returns true if a process contains the flag, otherwise false
 */
export default function hasFlag(flag: string, argv: string[] = (globalThis as any).Deno?.args ?? process.argv): boolean {
    const position = argv.indexOf(`${flag.startsWith('-') ? '' : flag.length === 1 ? '-' : '--'}${flag}`)
    const terminatorPosition = argv.indexOf('--')
    return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition)
}
