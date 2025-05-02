import { open } from 'node:fs/promises'

const bufferSize = 64 * 1024 // 64KB Buffer

export default async function* readLines(filePath: string): AsyncGenerator<string, void, unknown> {
    const fileHandle = await open(filePath, 'r')
    const buffer = Buffer.alloc(bufferSize)
    let leftover = ''
    let position = 0

    try {
        while (true) {
            const bytesRead = (await fileHandle.read(buffer, 0, bufferSize, position)).bytesRead
            if (bytesRead === 0) {
                // End of file: yield leftover if non-empty
                if (leftover.length > 0) {
                    yield leftover
                }
                break
            }

            // Convert read bytes to string and append to leftover
            const lines = (leftover + buffer.toString('utf8', 0, bytesRead)).split(/\r?\n/)

            // Store the last part as leftover for the next iteration
            leftover = lines.pop() ?? ''

            // Yield all complete lines
            for (const line of lines) {
                yield line
            }

            position += bytesRead
        }
    } finally {
        await fileHandle.close()
    }
}
