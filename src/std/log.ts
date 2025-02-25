/**
 *  Writes a string to stdout using low level functions.
 *
 *  @param outStream the string to write.
 */
export default function log(outStream: string): void {
    process.stdout.write(Buffer.from(`\n${outStream}\n`))
}
