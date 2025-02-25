import type { FileHandle } from 'node:fs/promises'

/**
 * Replaces a specific line or range of lines in a file using a low-level file handle.
 *
 * @param handle - The file handle to the target file.
 * @param oldContent - The current, previously read, content of the file.
 * @param newContent - The new content to write to the file.
 * @param startLine - The starting line number where the replacement should begin.
 * @param endLine - The ending line number where the replacement should end.
 */
export default async function replaceFileContent(
    handle: FileHandle,
    oldContent: string,
    newContent: string,
    start: number,
    end?: number
): Promise<void> {
    const lines = oldContent.split('\n')
    const newLines = newContent.split('\n')
    const write = [...lines.slice(0, start), ...newLines]
    const endIndex = end ?? start + newLines.length - 1
    if (endIndex + 1 < lines.length) write.push(...lines.slice(endIndex + 1))
    // Write the modified content back to the file
    await handle.truncate(0) // Clear the file
    await handle.write(write.join('\n'), 0, 'utf8')
}
