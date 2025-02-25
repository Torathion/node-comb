import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createTempDir, cleanupDir, tempFileName, createTempFile, tempDirName } from '../test-utils';
import { mkdir } from 'node:fs/promises';
import exists from '../../src/guards/exists';

describe('exists', () => {
    const currentFolder = dirname(fileURLToPath(import.meta.url));
    const tempDir = join(currentFolder, 'temp-exists');

    beforeAll(async () => {
        await createTempDir(tempDir);
    });

    afterAll(async () => {
        await cleanupDir(tempDir);
    });

    it('returns true for an existing file', async () => {
        const path = tempFileName(tempDir);
        await createTempFile(path, 'test content');

        expect(await exists(path)).toBe(true);
    });

    it('returns true for an existing directory', async () => {
        const dirPath = tempDirName(tempDir)
        await createTempDir(dirPath)

        expect(await exists(dirPath)).toBe(true);
    });

    it('returns false for a non-existent path', async () => {
        expect(await exists(tempFileName(tempDir, 'nonexistent'))).toBe(false);
    });

    it('returns true for an existing nested file', async () => {
        const nestedDir = tempDirName(tempDir, 'nested')
        await mkdir(nestedDir);
        const nestedFile = tempFileName(nestedDir, 'nested-file')
        await createTempFile(nestedFile, 'nested content');

        expect(await exists(nestedFile)).toBe(true);
    });

    it('returns false for a non-existent nested path', async () => {
        expect(await exists(tempFileName(tempDirName(tempDir, 'nonexistent-nested')))).toBe(false);
    });
});
