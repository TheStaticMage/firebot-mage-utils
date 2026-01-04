import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import model from '../closest-match';

describe('closestMatch variable', () => {
    let mockTrigger: Effects.Trigger;

    beforeEach(() => {
        mockTrigger = {} as Effects.Trigger;
    });

    describe('model definition', () => {
        it('should have correct handle', () => {
            expect(model.definition.handle).toBe('closestMatch');
        });

        it('should have proper description', () => {
            expect(model.definition.description).toContain('Finds the closest match');
            expect(model.definition.description).toContain('Levenshtein distance');
        });

        it('should have correct usage format', () => {
            expect(model.definition.usage).toBe('closestMatch[text, array]');
        });

        it('should have advanced category', () => {
            expect(model.definition.categories).toContain('advanced');
        });

        it('should output text type', () => {
            expect(model.definition.possibleDataOutput).toContain('text');
        });
    });

    describe('evaluator function', () => {
        describe('basic closest match functionality', () => {
            it('should find exact match in array of 5+ elements', () => {
                const searchArray = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig'];

                const result = model.evaluator(mockTrigger, 'banana', searchArray);
                expect(result).toBe('banana');
            });

            it('should find exact match with different case (case-insensitive)', () => {
                const searchArray = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

                const result = model.evaluator(mockTrigger, 'APPLE', searchArray);
                expect(result).toBe('Apple');
            });

            it('should prioritize exact match over closest match', () => {
                const searchArray = ['test', 'testing', 'tester', 'tests', 'tested'];

                const result = model.evaluator(mockTrigger, 'test', searchArray);
                expect(result).toBe('test');
            });

            it('should find exact match case-insensitively in mixed case array', () => {
                const searchArray = ['CamelCase', 'snake_case', 'kebab-case', 'PascalCase', 'UPPER_CASE'];

                const result = model.evaluator(mockTrigger, 'camelcase', searchArray);
                expect(result).toBe('CamelCase');
            });

            it('should find closest match with single character difference', () => {
                const searchArray = ['javascript', 'typescript', 'coffeescript', 'actionscript', 'livescript'];

                const result = model.evaluator(mockTrigger, 'javascrip', searchArray);
                expect(result).toBe('javascript');
            });

            it('should find closest match with multiple character differences', () => {
                const searchArray = ['programming', 'development', 'engineering', 'architecture', 'deployment'];

                const result = model.evaluator(mockTrigger, 'progaming', searchArray);
                expect(result).toBe('programming');
            });

            it('should find closest match with different case', () => {
                const searchArray = ['React', 'Angular', 'Vue', 'Svelte', 'Ember', 'Backbone'];

                const result = model.evaluator(mockTrigger, 'REACT', searchArray);
                expect(result).toBe('React');
            });

            it('should find closest match with partial word', () => {
                const searchArray = ['documentation', 'configuration', 'implementation', 'optimization', 'initialization'];

                const result = model.evaluator(mockTrigger, 'config', searchArray);
                expect(result).toBe('configuration');
            });

            it('should find closest match for longer text against shorter options', () => {
                const searchArray = ['JS', 'TS', 'CSS', 'HTML', 'XML', 'JSON'];

                const result = model.evaluator(mockTrigger, 'JavaScript', searchArray);
                expect(result).toBe('JS');
            });

            it('should find closest match for shorter text against longer options', () => {
                const searchArray = ['HyperTextMarkupLanguage', 'CascadingStyleSheets', 'JavaScriptObjectNotation', 'ExtensibleMarkupLanguage', 'ApplicationProgrammingInterface'];

                const result = model.evaluator(mockTrigger, 'HTML', searchArray);
                expect(result).toBe('CascadingStyleSheets');
            });

            it('should handle arrays with similar words', () => {
                const searchArray = ['test', 'testing', 'tester', 'tests', 'tested', 'testable'];

                const result = model.evaluator(mockTrigger, 'testin', searchArray);
                expect(result).toBe('testing');
            });

            it('should find match in array with mixed content types (all strings)', () => {
                const searchArray = ['user123', 'admin456', 'guest789', 'moderator321', 'superuser654', 'operator987'];

                const result = model.evaluator(mockTrigger, 'user12', searchArray);
                expect(result).toBe('user123');
            });

            it('should handle scientific/technical terms', () => {
                const searchArray = ['algorithm', 'heuristic', 'polynomial', 'exponential', 'logarithmic', 'quadratic'];

                const result = model.evaluator(mockTrigger, 'algoritm', searchArray);
                expect(result).toBe('algorithm');
            });
        });

        describe('case sensitivity and normalization', () => {
            it('should be case insensitive', () => {
                const searchArray = ['Apple', 'BANANA', 'cHeRrY', 'DATE', 'elderberry'];

                const result = model.evaluator(mockTrigger, 'apple', searchArray);
                expect(result).toBe('Apple');
            });

            it('should handle mixed case input and array', () => {
                const searchArray = ['CamelCase', 'snake_case', 'kebab-case', 'PascalCase', 'UPPER_CASE'];

                const result = model.evaluator(mockTrigger, 'camelcase', searchArray);
                expect(result).toBe('CamelCase');
            });

            it('should trim whitespace from input text', () => {
                const searchArray = ['hello', 'world', 'testing', 'example', 'sample'];

                const result = model.evaluator(mockTrigger, '  hello  ', searchArray);
                expect(result).toBe('hello');
            });

            it('should handle input with leading/trailing spaces', () => {
                const searchArray = ['javascript', 'python', 'java', 'golang', 'rust'];

                const result = model.evaluator(mockTrigger, '\tjavascript\n', searchArray);
                expect(result).toBe('javascript');
            });

            it('should handle empty strings in array', () => {
                const searchArray = ['', 'apple', 'banana', 'cherry', 'date'];

                const result = model.evaluator(mockTrigger, 'app', searchArray);
                expect(result).toBe('apple');
            });
        });

        describe('edge cases and error conditions', () => {
            it('should return empty string for empty text input', () => {
                const searchArray = ['apple', 'banana', 'cherry', 'date', 'elderberry'];

                const result = model.evaluator(mockTrigger, '', searchArray);
                expect(result).toBe('');
            });

            it('should return empty string for whitespace-only text input', () => {
                const searchArray = ['apple', 'banana', 'cherry', 'date', 'elderberry'];

                const result = model.evaluator(mockTrigger, '   ', searchArray);
                expect(result).toBe('');
            });

            it('should return empty string for null text input', () => {
                const searchArray = ['apple', 'banana', 'cherry', 'date', 'elderberry'];

                const result = model.evaluator(mockTrigger, null as any, searchArray);
                expect(result).toBe('');
            });

            it('should return empty string for undefined text input', () => {
                const searchArray = ['apple', 'banana', 'cherry', 'date', 'elderberry'];

                const result = model.evaluator(mockTrigger, undefined, searchArray);
                expect(result).toBe('');
            });

            it('should return empty string for non-string text input', () => {
                const searchArray = ['apple', 'banana', 'cherry', 'date', 'elderberry'];

                const result = model.evaluator(mockTrigger, 123 as any, searchArray);
                expect(result).toBe('');
            });

            it('should return empty string for empty array', () => {
                const result = model.evaluator(mockTrigger, 'test', []);
                expect(result).toBe('');
            });

            it('should return empty string for null array', () => {
                const result = model.evaluator(mockTrigger, 'test', null as any);
                expect(result).toBe('');
            });

            it('should return empty string for undefined array', () => {
                const result = model.evaluator(mockTrigger, 'test', undefined);
                expect(result).toBe('');
            });

            it('should return empty string for non-array input', () => {
                const result = model.evaluator(mockTrigger, 'test', 'not an array' as any);
                expect(result).toBe('');
            });

            it('should return empty string when both text and array are invalid', () => {
                const result = model.evaluator(mockTrigger, null as any, null as any);
                expect(result).toBe('');
            });

            it('should handle array with only empty strings', () => {
                const searchArray = ['', '', '', '', ''];

                const result = model.evaluator(mockTrigger, 'test', searchArray);
                expect(result).toBe('');
            });

            it('should handle very long text input', () => {
                const longText = 'a'.repeat(1000);
                const searchArray = ['apple', 'banana', 'cherry', 'date', 'elderberry'];

                const result = model.evaluator(mockTrigger, longText, searchArray);
                // Should return closest match (probably 'apple' due to starting with 'a')
                expect(typeof result).toBe('string');
                expect(searchArray).toContain(result);
            });

            it('should handle array with very long strings', () => {
                const veryLongString = 'verylongstring'.repeat(100);
                const searchArray = [veryLongString, 'short', 'medium', 'tiny', 'small'];

                const result = model.evaluator(mockTrigger, 'verylong', searchArray);
                expect(result).toBe('short');
            });
        });

        describe('special characters and unicode', () => {
            it('should handle special characters', () => {
                const searchArray = ['hello@world.com', 'test#123', 'user$name', 'file.txt', 'path/to/file'];

                const result = model.evaluator(mockTrigger, 'hello@world', searchArray);
                expect(result).toBe('hello@world.com');
            });

            it('should handle unicode characters', () => {
                const searchArray = ['café', 'naïve', 'résumé', 'façade', 'piñata'];

                const result = model.evaluator(mockTrigger, 'cafe', searchArray);
                expect(result).toBe('café');
            });

            it('should handle numbers as strings', () => {
                const searchArray = ['123456', '789012', '345678', '901234', '567890'];

                const result = model.evaluator(mockTrigger, '12345', searchArray);
                expect(result).toBe('123456');
            });

            it('should handle mixed alphanumeric strings', () => {
                const searchArray = ['abc123', 'def456', 'ghi789', 'jkl012', 'mno345'];

                const result = model.evaluator(mockTrigger, 'abc12', searchArray);
                expect(result).toBe('abc123');
            });

            it('should handle strings with spaces', () => {
                const searchArray = ['hello world', 'goodbye earth', 'welcome home', 'see you later', 'take care now'];

                const result = model.evaluator(mockTrigger, 'hello word', searchArray);
                expect(result).toBe('hello world');
            });
        });

        describe('algorithm behavior verification', () => {
            it('should return the most similar match when multiple close options exist', () => {
                const searchArray = ['test', 'tests', 'testing', 'tester', 'tested'];

                const result = model.evaluator(mockTrigger, 'tes', searchArray);
                expect(result).toBe('test'); // Should be closest
            });

            it('should handle completely different strings', () => {
                const searchArray = ['apple', 'banana', 'cherry', 'date', 'elderberry'];

                const result = model.evaluator(mockTrigger, 'xyz', searchArray);
                // Should return one of the options (algorithm will pick the "closest")
                expect(typeof result).toBe('string');
                expect(searchArray).toContain(result);
            });

            it('should handle single character array elements', () => {
                const searchArray = ['a', 'b', 'c', 'd', 'e'];

                const result = model.evaluator(mockTrigger, 'A', searchArray);
                expect(result).toBe('a');
            });

            it('should handle array with duplicate elements', () => {
                const searchArray = ['test', 'test', 'testing', 'test', 'tested'];

                const result = model.evaluator(mockTrigger, 'test', searchArray);
                expect(result).toBe('test');
            });

            it('should return first occurrence when exact match has duplicates', () => {
                const searchArray = ['apple', 'APPLE', 'Apple', 'banana', 'apple'];

                const result = model.evaluator(mockTrigger, 'apple', searchArray);
                expect(result).toBe('apple'); // Should return first occurrence
            });

            it('should return first occurrence when exact match has duplicates (case insensitive)', () => {
                const searchArray = ['React', 'react', 'REACT', 'Angular', 'Vue'];

                const result = model.evaluator(mockTrigger, 'REACT', searchArray);
                expect(result).toBe('React'); // Should return first occurrence (preserving original case)
            });

            it('should return first occurrence when closest match has duplicates', () => {
                const searchArray = ['testing', 'test', 'testing', 'tester', 'testing'];

                const result = model.evaluator(mockTrigger, 'testin', searchArray);
                expect(result).toBe('testing'); // Should return first occurrence of closest match
            });

            it('should ignore duplicate that is not the closest match', () => {
                const searchArray = ['example', 'example', 'test', 'testing', 'example'];

                const result = model.evaluator(mockTrigger, 'testin', searchArray);
                expect(result).toBe('testing'); // Should find 'testing' as closest, ignore 'example' duplicates
            });

            it('should handle duplicates with different cases', () => {
                const searchArray = ['Test', 'TEST', 'test', 'example', 'Test'];

                const result = model.evaluator(mockTrigger, 'test', searchArray);
                expect(result).toBe('Test'); // Should return first case-insensitive match
            });

            it('should handle closest match when multiple duplicates exist', () => {
                const searchArray = ['apple', 'apple', 'application', 'application', 'apply', 'apply'];

                const result = model.evaluator(mockTrigger, 'app', searchArray);
                // 'apple' should be closest to 'app', should return first occurrence
                expect(result).toBe('apple');
            });

            it('should handle mixed duplicates and unique elements', () => {
                const searchArray = ['banana', 'apple', 'apple', 'cherry', 'banana', 'date'];

                const result = model.evaluator(mockTrigger, 'apple', searchArray);
                expect(result).toBe('apple'); // Exact match, should return first occurrence
            });

            it('should handle large arrays efficiently', () => {
                // Create array with 100 elements
                const searchArray = Array.from({ length: 100 }, (_, i) => `item${i}`);
                searchArray.push('target');

                const result = model.evaluator(mockTrigger, 'target', searchArray);
                expect(result).toBe('target');
            });

            it('should handle case where result is neither string nor array (fallback)', () => {
                // This is a theoretical edge case - testing the fallback return
                const searchArray = ['test', 'example', 'sample', 'demo', 'mock'];

                const result = model.evaluator(mockTrigger, 'testcase', searchArray);
                expect(typeof result).toBe('string');
                expect(searchArray).toContain(result);
            });
        });
    });
});
