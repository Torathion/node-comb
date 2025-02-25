/**
 *  Writes an error to stderr using low level functions.
 *
 *  @param outStream the error to write.
 */
export default function writeError(outStream: Error): void {
    process.stderr.write(Buffer.from(`\n${outStream.stack!}\n`))
}
