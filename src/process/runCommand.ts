import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const pExec = promisify(exec)

/**
 *  Runs a CLI command as a promise.
 *
 *  @param commandString - text representing a cli command.
 *  @returns the output of said command.
 */
export default async function runCommand(commandString: string): Promise<{ stderr: string; stdout: string }> {
    return pExec(commandString)
}
