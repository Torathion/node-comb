const escape = '\u001B['

/**
 *  Clears the last line of stdout by using low level write commands.
 */
export default function clearLastLogLine(): void {
    process.stdout.write(`${escape}A`)
    process.stdout.write(`${escape}K`)
}
