import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Mock the firebot and logger modules before importing the model
jest.mock('../main', () => ({
    firebot: {
        modules: {
            fs: require('fs'),
            path: require('path')
        }
    },
    logger: {
        error: jest.fn(),
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn()
    }
}));

import model from './file-name-with-extension';

describe('fileNameWithExtension variable', () => {
    let tempDir: string;
    let mockTrigger: Effects.Trigger;

    beforeEach(() => {
        // Create a unique temporary directory for each test
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'filename-ext-test-'));
        mockTrigger = {} as Effects.Trigger;

        // Clear mock calls
        jest.clearAllMocks();
    });

    afterEach(() => {
        // Clean up temporary directory after each test
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    describe('model definition', () => {
        it('should have correct handle', () => {
            expect(model.definition.handle).toBe('fileNameWithExtension');
        });

        it('should have proper description', () => {
            expect(model.definition.description).toContain('Finds the file');
            expect(model.definition.description).toContain('with its extension');
        });

        it('should have correct usage format', () => {
            expect(model.definition.usage).toBe('fileNameWithExtension[c:/path/to/directory, filename]');
        });

        it('should have advanced category', () => {
            expect(model.definition.categories).toContain('advanced');
        });

        it('should output text type', () => {
            expect(model.definition.possibleDataOutput).toContain('text');
        });
    });

    describe('evaluator function', () => {
        describe('basic file matching', () => {
            it('should return exact filename match when file exists', () => {
                // Create test file with exact name
                fs.writeFileSync(path.join(tempDir, 'testfile'), 'content');

                const result = model.evaluator(mockTrigger, tempDir, 'testfile');
                expect(result).toBe('testfile');
            });

            it('should return filename with extension when exact match not found', () => {
                // Create file with extension
                fs.writeFileSync(path.join(tempDir, 'testfile.txt'), 'content');

                const result = model.evaluator(mockTrigger, tempDir, 'testfile');
                expect(result).toBe('testfile.txt');
            });

            it('should prefer exact match over extension match', () => {
                // Create both exact match and extension match
                fs.writeFileSync(path.join(tempDir, 'testfile'), 'exact content');
                fs.writeFileSync(path.join(tempDir, 'testfile.txt'), 'extension content');

                const result = model.evaluator(mockTrigger, tempDir, 'testfile');
                expect(result).toBe('testfile');
            });

            it('should return first extension match when multiple extensions exist', () => {
                // Create multiple files with different extensions
                fs.writeFileSync(path.join(tempDir, 'testfile.txt'), 'txt content');
                fs.writeFileSync(path.join(tempDir, 'testfile.md'), 'md content');
                fs.writeFileSync(path.join(tempDir, 'testfile.js'), 'js content');

                const result = model.evaluator(mockTrigger, tempDir, 'testfile');
                // Should return one of the extension matches
                expect(['testfile.txt', 'testfile.md', 'testfile.js']).toContain(result);
                expect(result).not.toBe('testfile');
            });

            it('should handle files with multiple dots in extension', () => {
                fs.writeFileSync(path.join(tempDir, 'archive.tar.gz'), 'archive content');

                const result = model.evaluator(mockTrigger, tempDir, 'archive');
                expect(result).toBe('archive.tar.gz');
            });

            it('should handle files starting with dots', () => {
                fs.writeFileSync(path.join(tempDir, '.hidden.txt'), 'hidden content');

                const result = model.evaluator(mockTrigger, tempDir, '.hidden');
                expect(result).toBe('.hidden.txt');
            });

            it('should handle files ending with dots', () => {
                fs.writeFileSync(path.join(tempDir, 'file.'), 'dot content');

                const result = model.evaluator(mockTrigger, tempDir, 'file');
                expect(result).toBe('file.');
            });
        });

        describe('case sensitivity', () => {
            it('should be case sensitive for exact matches', () => {
                fs.writeFileSync(path.join(tempDir, 'TestFile'), 'content');

                const result = model.evaluator(mockTrigger, tempDir, 'testfile');
                expect(result).toBe('');
            });

            it('should be case sensitive for extension matches', () => {
                fs.writeFileSync(path.join(tempDir, 'TestFile.txt'), 'content');

                const result = model.evaluator(mockTrigger, tempDir, 'testfile');
                expect(result).toBe('');
            });

            it('should return correct case when found', () => {
                fs.writeFileSync(path.join(tempDir, 'TestFile.TXT'), 'content');

                const result = model.evaluator(mockTrigger, tempDir, 'TestFile');
                expect(result).toBe('TestFile.TXT');
            });
        });

        describe('file existence verification', () => {
            it('should verify file actually exists on disk', () => {
                // Create a file then delete it (simulating a race condition)
                const filePath = path.join(tempDir, 'testfile.txt');
                fs.writeFileSync(filePath, 'content');

                // Mock the directory listing to include the file
                const mockReaddirSync = jest.spyOn(fs, 'readdirSync').mockReturnValue(['testfile.txt'] as any);

                // Delete the actual file
                fs.unlinkSync(filePath);

                const result = model.evaluator(mockTrigger, tempDir, 'testfile');
                expect(result).toBe('');

                // Restore original function
                mockReaddirSync.mockRestore();
            });

            it('should handle broken symlinks gracefully', () => {
                // This test might be platform-specific, so we'll skip on Windows
                if (process.platform === 'win32') {
                    return;
                }

                // Create a symlink to a non-existent file
                try {
                    fs.symlinkSync('/nonexistent/target', path.join(tempDir, 'testfile.txt'));

                    const result = model.evaluator(mockTrigger, tempDir, 'testfile');
                    expect(result).toBe('');
                } catch (err) {
                    // If we can't create symlinks, skip this test
                    // Note: Using console.log is acceptable in test environments for debugging
                    // eslint-disable-next-line no-console
                    console.log('Skipping symlink test:', err);
                }
            });
        });

        describe('directory structure handling', () => {
            it('should not match files in subdirectories', () => {
                // Create subdirectory with matching file
                fs.mkdirSync(path.join(tempDir, 'subdir'));
                fs.writeFileSync(path.join(tempDir, 'subdir', 'testfile.txt'), 'content');

                const result = model.evaluator(mockTrigger, tempDir, 'testfile');
                expect(result).toBe('');
            });

            it('should ignore directory names that match pattern', () => {
                // Create directory with matching name
                fs.mkdirSync(path.join(tempDir, 'testfile.dir'));

                // Function should NOT return directory names, only files
                const result = model.evaluator(mockTrigger, tempDir, 'testfile');
                expect(result).toBe('');
            });

            it('should prefer file over directory with same name', () => {
                // Create both a file and directory with same base name
                fs.writeFileSync(path.join(tempDir, 'testfile'), 'file content');
                fs.mkdirSync(path.join(tempDir, 'testfile.dir'));

                // Should return the file, not the directory
                const result = model.evaluator(mockTrigger, tempDir, 'testfile');
                expect(result).toBe('testfile');
            });

            it('should ignore directories when looking for extensions', () => {
                // Create directory with extension pattern
                fs.mkdirSync(path.join(tempDir, 'testfile.txt'));

                // Function should NOT return directory, even with extension pattern
                const result = model.evaluator(mockTrigger, tempDir, 'testfile');
                expect(result).toBe('');
            });

            it('should return file when both file and directory have extensions', () => {
                // Create both file and directory with extensions
                fs.writeFileSync(path.join(tempDir, 'testfile.txt'), 'file content');
                fs.mkdirSync(path.join(tempDir, 'testfile.dir'));

                // Should return the file with extension, not directory
                const result = model.evaluator(mockTrigger, tempDir, 'testfile');
                expect(result).toBe('testfile.txt');
            });

            it('should work with nested directory path', () => {
                // Create nested directory structure
                const nestedDir = path.join(tempDir, 'nested', 'deep');
                fs.mkdirSync(nestedDir, { recursive: true });
                fs.writeFileSync(path.join(nestedDir, 'testfile.txt'), 'content');

                const result = model.evaluator(mockTrigger, nestedDir, 'testfile');
                expect(result).toBe('testfile.txt');
            });
        });

        describe('parameter validation', () => {
            it('should return empty string when filePath is missing', () => {
                const result = model.evaluator(mockTrigger, undefined, 'testfile');
                expect(result).toBe('');
            });

            it('should return empty string when filePath is empty', () => {
                const result = model.evaluator(mockTrigger, '', 'testfile');
                expect(result).toBe('');
            });

            it('should return empty string when filename is missing', () => {
                const result = model.evaluator(mockTrigger, tempDir, undefined);
                expect(result).toBe('');
            });

            it('should return empty string when filename is empty', () => {
                const result = model.evaluator(mockTrigger, tempDir, '');
                expect(result).toBe('');
            });

            it('should return empty string when both parameters are missing', () => {
                const result = model.evaluator(mockTrigger, undefined, undefined);
                expect(result).toBe('');
            });

            it('should handle null parameters gracefully', () => {
                const result = model.evaluator(mockTrigger, null as any, null as any);
                expect(result).toBe('');
            });
        });

        describe('error handling', () => {
            it('should return empty string for non-existent directory', () => {
                const invalidPath = path.join(tempDir, 'nonexistent');

                const result = model.evaluator(mockTrigger, invalidPath, 'testfile');
                expect(result).toBe('');
            });

            it('should return empty string when directory path is a file', () => {
                const filePath = path.join(tempDir, 'notadirectory.txt');
                fs.writeFileSync(filePath, 'content');

                const result = model.evaluator(mockTrigger, filePath, 'testfile');
                expect(result).toBe('');
            });

            it('should log error details when directory read fails', () => {
                const { logger } = require('../main');
                const invalidPath = '/nonexistent/directory';

                model.evaluator(mockTrigger, invalidPath, 'testfile');

                expect(logger.error).toHaveBeenCalledWith(
                    expect.stringContaining('Error reading directory in fileNameWithExtension variable')
                );
                expect(logger.error).toHaveBeenCalledWith(
                    expect.stringContaining(`filePath=${invalidPath}`)
                );
                expect(logger.error).toHaveBeenCalledWith(
                    expect.stringContaining('filename=testfile')
                );
            });

            it('should handle permission errors gracefully', () => {
                // This test is platform-specific and may not work in all environments
                if (process.platform === 'win32') {
                    return; // Skip on Windows due to different permission model
                }

                try {
                    // Create a directory and remove read permissions
                    const restrictedDir = path.join(tempDir, 'restricted');
                    fs.mkdirSync(restrictedDir);
                    fs.chmodSync(restrictedDir, 0o000);

                    const result = model.evaluator(mockTrigger, restrictedDir, 'testfile');
                    expect(result).toBe('');

                    // Restore permissions for cleanup
                    fs.chmodSync(restrictedDir, 0o755);
                } catch (err) {
                    // If permission manipulation fails, skip this test
                    // eslint-disable-next-line no-console
                    console.log('Skipping permission test:', err);
                }
            });

            it('should handle stat errors gracefully', () => {
                // Create a file then mock fs.statSync to throw an error
                fs.writeFileSync(path.join(tempDir, 'testfile.txt'), 'content');

                const mockStatSync = jest.spyOn(fs, 'statSync').mockImplementation(() => {
                    throw new Error('Stat error');
                });

                const result = model.evaluator(mockTrigger, tempDir, 'testfile');
                expect(result).toBe('');

                // Restore original function
                mockStatSync.mockRestore();
            });
        });

        describe('special characters and edge cases', () => {
            it('should handle filenames with spaces', () => {
                fs.writeFileSync(path.join(tempDir, 'file with spaces.txt'), 'content');

                const result = model.evaluator(mockTrigger, tempDir, 'file with spaces');
                expect(result).toBe('file with spaces.txt');
            });

            it('should handle filenames with special characters', () => {
                const specialName = 'file-with_special@chars';
                fs.writeFileSync(path.join(tempDir, `${specialName}.txt`), 'content');

                const result = model.evaluator(mockTrigger, tempDir, specialName);
                expect(result).toBe(`${specialName}.txt`);
            });

            it('should handle unicode filenames', () => {
                const unicodeName = 'ファイル';
                fs.writeFileSync(path.join(tempDir, `${unicodeName}.txt`), 'content');

                const result = model.evaluator(mockTrigger, tempDir, unicodeName);
                expect(result).toBe(`${unicodeName}.txt`);
            });

            it('should handle very long filenames', () => {
                const longName = 'a'.repeat(100);
                fs.writeFileSync(path.join(tempDir, `${longName}.txt`), 'content');

                const result = model.evaluator(mockTrigger, tempDir, longName);
                expect(result).toBe(`${longName}.txt`);
            });

            it('should handle filenames that are just extensions', () => {
                fs.writeFileSync(path.join(tempDir, '.gitignore'), 'content');

                const result = model.evaluator(mockTrigger, tempDir, '.gitignore');
                expect(result).toBe('.gitignore');
            });

            it('should handle empty extension', () => {
                fs.writeFileSync(path.join(tempDir, 'file.'), 'content');

                const result = model.evaluator(mockTrigger, tempDir, 'file');
                expect(result).toBe('file.');
            });

            it('should handle multiple consecutive dots', () => {
                fs.writeFileSync(path.join(tempDir, 'file...txt'), 'content');

                const result = model.evaluator(mockTrigger, tempDir, 'file');
                expect(result).toBe('file...txt');
            });
        });

        describe('search behavior edge cases', () => {
            it('should not return partial matches', () => {
                fs.writeFileSync(path.join(tempDir, 'testfile123.txt'), 'content');
                fs.writeFileSync(path.join(tempDir, 'mytestfile.txt'), 'content');

                const result = model.evaluator(mockTrigger, tempDir, 'testfile');
                expect(result).toBe('');
            });

            it('should handle filename that is substring of another', () => {
                fs.writeFileSync(path.join(tempDir, 'test.txt'), 'content');
                fs.writeFileSync(path.join(tempDir, 'testing.txt'), 'content');

                const result = model.evaluator(mockTrigger, tempDir, 'test');
                expect(result).toBe('test.txt');
            });

            it('should handle when filename matches directory listing pattern', () => {
                fs.writeFileSync(path.join(tempDir, 'file.bak'), 'content');
                fs.writeFileSync(path.join(tempDir, 'file.backup'), 'content');

                const result = model.evaluator(mockTrigger, tempDir, 'file');
                // Should return one of them (order depends on file system)
                expect(['file.bak', 'file.backup']).toContain(result);
            });

            it('should return empty string when no files match', () => {
                fs.writeFileSync(path.join(tempDir, 'otherfile.txt'), 'content');
                fs.writeFileSync(path.join(tempDir, 'anotherfile.js'), 'content');

                const result = model.evaluator(mockTrigger, tempDir, 'testfile');
                expect(result).toBe('');
            });

            it('should handle directory with many files efficiently', () => {
                // Create many files to test performance doesn't degrade
                for (let i = 0; i < 100; i++) {
                    fs.writeFileSync(path.join(tempDir, `file${i}.txt`), 'content');
                }
                fs.writeFileSync(path.join(tempDir, 'target.txt'), 'target content');

                const result = model.evaluator(mockTrigger, tempDir, 'target');
                expect(result).toBe('target.txt');
            });
        });
    });
});
