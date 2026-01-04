import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Mock the firebot and logger modules before importing the model
jest.mock('../../main', () => ({
    firebot: {
        modules: {
            fs: require('fs')
        }
    },
    logger: {
        error: jest.fn(),
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn()
    }
}));

import model from '../filenames-in-directory';

describe('filenamesInDirectory variable', () => {
    let tempDir: string;
    let mockTrigger: Effects.Trigger;

    beforeEach(() => {
        // Create a unique temporary directory for each test
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'filenames-test-'));
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
            expect(model.definition.handle).toBe('filenamesInDirectory');
        });

        it('should have proper description', () => {
            expect(model.definition.description).toContain('Returns an array of filenames');
            expect(model.definition.description).toContain('not subdirectories');
        });

        it('should have correct usage format', () => {
            expect(model.definition.usage).toBe('filenamesInDirectory[c:/path/to/directory]');
        });

        it('should have examples array', () => {
            expect(Array.isArray(model.definition.examples)).toBe(true);
            expect(model.definition.examples?.length).toBeGreaterThan(0);
        });

        it('should have advanced category', () => {
            expect(model.definition.categories).toContain('advanced');
        });

        it('should output array type', () => {
            expect(model.definition.possibleDataOutput).toContain('array');
        });
    });

    describe('evaluator function', () => {
        describe('basic file listing', () => {
            it('should return empty array for empty directory', () => {
                const result = model.evaluator(mockTrigger, tempDir);
                expect(result).toEqual([]);
            });

            it('should list all files in directory', () => {
                // Create test files
                fs.writeFileSync(path.join(tempDir, 'file1.txt'), 'content1');
                fs.writeFileSync(path.join(tempDir, 'file2.js'), 'content2');
                fs.writeFileSync(path.join(tempDir, 'file3.json'), 'content3');

                const result = model.evaluator(mockTrigger, tempDir);
                expect(result).toHaveLength(3);
                expect(result).toContain('file1.txt');
                expect(result).toContain('file2.js');
                expect(result).toContain('file3.json');
            });

            it('should exclude subdirectories from results', () => {
                // Create files and subdirectories
                fs.writeFileSync(path.join(tempDir, 'file1.txt'), 'content1');
                fs.writeFileSync(path.join(tempDir, 'file2.js'), 'content2');
                fs.mkdirSync(path.join(tempDir, 'subdir1'));
                fs.mkdirSync(path.join(tempDir, 'subdir2'));

                // Create files in subdirectories
                fs.writeFileSync(path.join(tempDir, 'subdir1', 'nested.txt'), 'nested content');

                const result = model.evaluator(mockTrigger, tempDir);
                expect(result).toHaveLength(2);
                expect(result).toContain('file1.txt');
                expect(result).toContain('file2.js');
                expect(result).not.toContain('subdir1');
                expect(result).not.toContain('subdir2');
                expect(result).not.toContain('nested.txt');
            });

            it('should handle files with no extensions', () => {
                fs.writeFileSync(path.join(tempDir, 'README'), 'readme content');
                fs.writeFileSync(path.join(tempDir, 'Makefile'), 'makefile content');
                fs.writeFileSync(path.join(tempDir, 'file.txt'), 'text content');

                const result = model.evaluator(mockTrigger, tempDir);
                expect(result).toHaveLength(3);
                expect(result).toContain('README');
                expect(result).toContain('Makefile');
                expect(result).toContain('file.txt');
            });

            it('should handle files with multiple dots in names', () => {
                fs.writeFileSync(path.join(tempDir, 'file.backup.txt'), 'backup content');
                fs.writeFileSync(path.join(tempDir, 'config.local.json'), 'config content');
                fs.writeFileSync(path.join(tempDir, 'script.min.js'), 'script content');

                const result = model.evaluator(mockTrigger, tempDir);
                expect(result).toHaveLength(3);
                expect(result).toContain('file.backup.txt');
                expect(result).toContain('config.local.json');
                expect(result).toContain('script.min.js');
            });
        });

        describe('regex filtering', () => {
            beforeEach(() => {
                // Create a variety of test files
                fs.writeFileSync(path.join(tempDir, 'document.txt'), 'content');
                fs.writeFileSync(path.join(tempDir, 'script.js'), 'content');
                fs.writeFileSync(path.join(tempDir, 'style.css'), 'content');
                fs.writeFileSync(path.join(tempDir, 'image.png'), 'content');
                fs.writeFileSync(path.join(tempDir, 'data.json'), 'content');
                fs.writeFileSync(path.join(tempDir, 'README.md'), 'content');
                fs.writeFileSync(path.join(tempDir, 'test_file.txt'), 'content');
                fs.writeFileSync(path.join(tempDir, 'UPPERCASE.TXT'), 'content');
            });

            it('should filter files by extension', () => {
                const result = model.evaluator(mockTrigger, tempDir, '\\.txt$');
                expect(result).toHaveLength(2);
                expect(result).toContain('document.txt');
                expect(result).toContain('test_file.txt');
                expect(result).not.toContain('UPPERCASE.TXT'); // Case sensitive by default
            });

            it('should filter files with case-insensitive flag', () => {
                const result = model.evaluator(mockTrigger, tempDir, '\\.txt$', 'i');
                expect(result).toHaveLength(3);
                expect(result).toContain('document.txt');
                expect(result).toContain('test_file.txt');
                expect(result).toContain('UPPERCASE.TXT');
            });

            it('should filter files by name pattern', () => {
                const result = model.evaluator(mockTrigger, tempDir, '^test');
                expect(result).toHaveLength(1);
                expect(result).toContain('test_file.txt');
            });

            it('should filter files with multiple extensions', () => {
                const result = model.evaluator(mockTrigger, tempDir, '\\.(js|css|json)$');
                expect(result).toHaveLength(3);
                expect(result).toContain('script.js');
                expect(result).toContain('style.css');
                expect(result).toContain('data.json');
            });

            it('should return all files when filter is empty string', () => {
                const result = model.evaluator(mockTrigger, tempDir, '');
                expect(result).toHaveLength(8); // All files created in beforeEach
            });

            it('should return all files when filter is null', () => {
                const result = model.evaluator(mockTrigger, tempDir, null);
                expect(result).toHaveLength(8); // All files created in beforeEach
            });

            it('should handle complex regex patterns', () => {
                const result = model.evaluator(mockTrigger, tempDir, '(document|image)\\.');
                expect(result).toHaveLength(2);
                expect(result).toContain('document.txt');
                expect(result).toContain('image.png');
            });

            it('should handle global flag', () => {
                const result = model.evaluator(mockTrigger, tempDir, 'e', 'g');
                // Should match files containing 'e'
                expect(result.length).toBeGreaterThan(0);
                expect(result).toContain('test_file.txt');
                expect(result).toContain('style.css');
                // Note: image.png may not match depending on case sensitivity
            });
        });

        describe('extension stripping', () => {
            beforeEach(() => {
                fs.writeFileSync(path.join(tempDir, 'document.txt'), 'content');
                fs.writeFileSync(path.join(tempDir, 'script.min.js'), 'content');
                fs.writeFileSync(path.join(tempDir, 'config.local.json'), 'content');
                fs.writeFileSync(path.join(tempDir, 'README'), 'content'); // No extension
                fs.writeFileSync(path.join(tempDir, '.hidden'), 'content'); // Starts with dot
                fs.writeFileSync(path.join(tempDir, 'file.'), 'content'); // Ends with dot
            });

            it('should strip extensions when stripExtension is true', () => {
                const result = model.evaluator(mockTrigger, tempDir, null, '', true);
                expect(result).toHaveLength(6);
                expect(result).toContain('document');
                expect(result).toContain('script.min');
                expect(result).toContain('config.local');
                expect(result).toContain('README'); // No change
                expect(result).toContain(''); // .hidden becomes empty string after stripping
                expect(result).toContain('file'); // Strips trailing dot
            });

            it('should not strip extensions when stripExtension is false', () => {
                const result = model.evaluator(mockTrigger, tempDir, null, '', false);
                expect(result).toHaveLength(6);
                expect(result).toContain('document.txt');
                expect(result).toContain('script.min.js');
                expect(result).toContain('config.local.json');
                expect(result).toContain('README');
                expect(result).toContain('.hidden');
                expect(result).toContain('file.');
            });

            it('should strip extensions with regex filter', () => {
                const result = model.evaluator(mockTrigger, tempDir, '\\.js$', '', true);
                expect(result).toHaveLength(1);
                expect(result).toContain('script.min');
            });

            it('should handle files with multiple dots correctly', () => {
                fs.writeFileSync(path.join(tempDir, 'archive.tar.gz'), 'content');
                fs.writeFileSync(path.join(tempDir, 'backup.sql.bak'), 'content');

                const result = model.evaluator(mockTrigger, tempDir, '\\.(gz|bak)$', '', true);
                expect(result).toHaveLength(2);
                expect(result).toContain('archive.tar');
                expect(result).toContain('backup.sql');
            });
        });

        describe('combined functionality', () => {
            beforeEach(() => {
                fs.writeFileSync(path.join(tempDir, 'test1.txt'), 'content');
                fs.writeFileSync(path.join(tempDir, 'test2.TXT'), 'content');
                fs.writeFileSync(path.join(tempDir, 'demo.txt'), 'content');
                fs.writeFileSync(path.join(tempDir, 'script.js'), 'content');
                fs.mkdirSync(path.join(tempDir, 'subdir'));
                fs.writeFileSync(path.join(tempDir, 'subdir', 'nested.txt'), 'content');
            });

            it('should combine regex filtering and extension stripping', () => {
                const result = model.evaluator(mockTrigger, tempDir, '\\.txt$', 'i', true);
                expect(result).toHaveLength(3);
                expect(result).toContain('test1');
                expect(result).toContain('test2');
                expect(result).toContain('demo');
                expect(result).not.toContain('script');
            });

            it('should handle all parameters together', () => {
                const result = model.evaluator(mockTrigger, tempDir, '^test', 'i', true);
                expect(result).toHaveLength(2);
                expect(result).toContain('test1');
                expect(result).toContain('test2');
            });
        });

        describe('error handling', () => {
            it('should return empty array for empty string path', () => {
                const result = model.evaluator(mockTrigger, '');
                expect(result).toEqual([]);
            });

            it('should return empty array for non-string path', () => {
                const result = model.evaluator(mockTrigger, null as any);
                expect(result).toEqual([]);

                const result2 = model.evaluator(mockTrigger, undefined as any);
                expect(result2).toEqual([]);

                const result3 = model.evaluator(mockTrigger, 123 as any);
                expect(result3).toEqual([]);
            });

            it('should return error message for non-existent directory', () => {
                const invalidPath = path.join(tempDir, 'nonexistent');
                const result = model.evaluator(mockTrigger, invalidPath);
                expect(result).toEqual(['[Invalid Directory Path]']);
            });

            it('should return error message for file path instead of directory', () => {
                const filePath = path.join(tempDir, 'testfile.txt');
                fs.writeFileSync(filePath, 'content');

                const result = model.evaluator(mockTrigger, filePath);
                expect(result).toEqual(['[Invalid Directory Path]']);
            });

            it('should handle invalid regex gracefully', () => {
                fs.writeFileSync(path.join(tempDir, 'test.txt'), 'content');

                // Invalid regex pattern
                const result = model.evaluator(mockTrigger, tempDir, '[');
                expect(result).toEqual(['[Invalid Directory Path]']);
            });

            it('should log error details when directory read fails', () => {
                const { logger } = require('../../main');
                const invalidPath = '/nonexistent/directory';

                model.evaluator(mockTrigger, invalidPath);

                expect(logger.error).toHaveBeenCalledWith(
                    expect.stringContaining('Error reading directory in filenamesInDirectory variable')
                );
                expect(logger.error).toHaveBeenCalledWith(
                    expect.stringContaining(`dirpath=${invalidPath}`)
                );
            });
        });

        describe('edge cases', () => {
            it('should handle very long filenames', () => {
                const longFilename = `${'a'.repeat(200)}.txt`;
                fs.writeFileSync(path.join(tempDir, longFilename), 'content');

                const result = model.evaluator(mockTrigger, tempDir);
                expect(result).toHaveLength(1);
                expect(result[0]).toBe(longFilename);
            });

            it('should handle special characters in filenames', () => {
                const specialFiles = [
                    'file with spaces.txt',
                    'file-with-dashes.txt',
                    'file_with_underscores.txt',
                    'file(with)parentheses.txt',
                    'file[with]brackets.txt',
                    'file{with}braces.txt'
                ];

                specialFiles.forEach((filename) => {
                    fs.writeFileSync(path.join(tempDir, filename), 'content');
                });

                const result = model.evaluator(mockTrigger, tempDir);
                expect(result).toHaveLength(specialFiles.length);
                specialFiles.forEach((filename) => {
                    expect(result).toContain(filename);
                });
            });

            it('should handle unicode filenames', () => {
                const unicodeFiles = [
                    'ファイル.txt',
                    'файл.txt',
                    'αρχείο.txt',
                    '文件.txt'
                ];

                unicodeFiles.forEach((filename) => {
                    fs.writeFileSync(path.join(tempDir, filename), 'content');
                });

                const result = model.evaluator(mockTrigger, tempDir);
                expect(result).toHaveLength(unicodeFiles.length);
                unicodeFiles.forEach((filename) => {
                    expect(result).toContain(filename);
                });
            });

            it('should handle empty regex with flags', () => {
                fs.writeFileSync(path.join(tempDir, 'test.txt'), 'content');

                const result = model.evaluator(mockTrigger, tempDir, '', 'gi');
                expect(result).toHaveLength(1);
                expect(result).toContain('test.txt');
            });

            it('should handle boolean stripExtension parameter variations', () => {
                fs.writeFileSync(path.join(tempDir, 'test.txt'), 'content');

                // Test with explicit false
                const result1 = model.evaluator(mockTrigger, tempDir, null, '', false);
                expect(result1).toContain('test.txt');

                // Test with truthy value
                const result2 = model.evaluator(mockTrigger, tempDir, null, '', 'true' as any);
                expect(result2).toContain('test'); // Should strip extension
            });
        });
    });
});
