import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import flattenArrayModel from "../flatten-array";

const trigger = {} as Effects.Trigger;

describe("flattenArray replace variable", () => {
    describe("edge cases - invalid input", () => {
        it("null input should return empty array", () => {
            const result = flattenArrayModel.evaluator(trigger, null);
            expect(result).toEqual([]);
        });

        it("undefined input should return empty array", () => {
            const result = flattenArrayModel.evaluator(trigger, undefined);
            expect(result).toEqual([]);
        });

        it("empty string input should return empty array", () => {
            const result = flattenArrayModel.evaluator(trigger, "");
            expect(result).toEqual([]);
        });

        it("whitespace-only string should return empty array", () => {
            const result = flattenArrayModel.evaluator(trigger, "   ");
            expect(result).toEqual([]);
        });
    });

    describe("edge cases - primitive inputs", () => {
        it("single string should be wrapped in array", () => {
            const result = flattenArrayModel.evaluator(trigger, "foo");
            expect(result).toEqual(["foo"]);
        });

        it("single number 42 should be wrapped in array", () => {
            const result = flattenArrayModel.evaluator(trigger, 42);
            expect(result).toEqual([42]);
        });

        it("boolean true should be wrapped in array", () => {
            const result = flattenArrayModel.evaluator(trigger, true);
            expect(result).toEqual([true]);
        });

        it("boolean false should be wrapped in array", () => {
            const result = flattenArrayModel.evaluator(trigger, false);
            expect(result).toEqual([false]);
        });

        it("zero should be wrapped in array", () => {
            const result = flattenArrayModel.evaluator(trigger, 0);
            expect(result).toEqual([0]);
        });

        it("negative number should be wrapped in array", () => {
            const result = flattenArrayModel.evaluator(trigger, -5);
            expect(result).toEqual([-5]);
        });
    });

    describe("simple arrays", () => {
        it("empty array should return empty array", () => {
            const result = flattenArrayModel.evaluator(trigger, []);
            expect(result).toEqual([]);
        });

        it("single element array should return that element in array", () => {
            const result = flattenArrayModel.evaluator(trigger, [1]);
            expect(result).toEqual([1]);
        });

        it("flat array should return unchanged", () => {
            const result = flattenArrayModel.evaluator(trigger, [1, 2, 3]);
            expect(result).toEqual([1, 2, 3]);
        });

        it("flat array with mixed types should return unchanged", () => {
            const result = flattenArrayModel.evaluator(trigger, [1, "a", true]);
            expect(result).toEqual([1, "a", true]);
        });
    });

    describe("nested arrays", () => {
        it("one level of nesting should be flattened", () => {
            const result = flattenArrayModel.evaluator(trigger, [1, [2, 3]]);
            expect(result).toEqual([1, 2, 3]);
        });

        it("two levels of nesting should be flattened", () => {
            const result = flattenArrayModel.evaluator(trigger, [1, [2, [3]]]);
            expect(result).toEqual([1, 2, 3]);
        });

        it("deep nesting should be fully flattened", () => {
            const result = flattenArrayModel.evaluator(trigger, [[[1]], [[2]], [3]]);
            expect(result).toEqual([1, 2, 3]);
        });

        it("complex deep nesting should be flattened", () => {
            const result = flattenArrayModel.evaluator(
                trigger,
                [1, [2, [3, [4, [5]]]]]
            );
            expect(result).toEqual([1, 2, 3, 4, 5]);
        });

        it("arrays with multiple nesting levels at different depths", () => {
            const result = flattenArrayModel.evaluator(trigger, [
                [1, 2],
                [3, [4, 5]],
                6
            ]);
            expect(result).toEqual([1, 2, 3, 4, 5, 6]);
        });
    });

    describe("objects and maps", () => {
        it("simple object should return keys as array", () => {
            const result = flattenArrayModel.evaluator(trigger, { a: 1, b: 2 });
            expect(result.sort()).toEqual(["a", "b"]);
        });

        it("empty object should return empty array", () => {
            const result = flattenArrayModel.evaluator(trigger, {});
            expect(result).toEqual([]);
        });

        it("nested object should return only top-level keys", () => {
            const result = flattenArrayModel.evaluator(trigger, { a: { b: 1 } });
            expect(result).toEqual(["a"]);
        });

        it("object with array values should extract keys only", () => {
            const result = flattenArrayModel.evaluator(trigger, { a: [1, 2] });
            expect(result).toEqual(["a"]);
        });

        it("Map should extract keys", () => {
            const map = new Map();
            map.set("key1", 1);
            map.set("key2", 2);
            const result = flattenArrayModel.evaluator(trigger, map);
            expect(result.sort()).toEqual(["key1", "key2"]);
        });
    });

    describe("mixed structures", () => {
        it("array with objects should extract keys only", () => {
            const result = flattenArrayModel.evaluator(trigger, [
                { a: 1 },
                { b: 2 }
            ]);
            expect(result.sort()).toEqual(["a", "b"]);
        });

        it("array with nested objects should extract keys only", () => {
            const result = flattenArrayModel.evaluator(trigger, [
                1,
                { a: [2, 3] },
                4
            ]);
            expect(result.sort()).toEqual([1, 4, "a"]);
        });

        it("complex mixed structure should flatten arrays and extract keys", () => {
            const result = flattenArrayModel.evaluator(trigger, [
                [{ a: [1, 2] }, 3],
                4
            ]);
            expect(result.sort()).toEqual([3, 4, "a"]);
        });

        it("array with object containing nested array should extract keys only", () => {
            const result = flattenArrayModel.evaluator(trigger, [
                {
                    nested: [1, [2, 3]]
                },
                4
            ]);
            expect(result.sort()).toEqual([4, "nested"]);
        });
    });

    describe("JSON string input", () => {
        it("JSON string array should be parsed and flattened", () => {
            const result = flattenArrayModel.evaluator(trigger, "[1, 2, 3]");
            expect(result).toEqual([1, 2, 3]);
        });

        it("JSON string nested array should be flattened", () => {
            const result = flattenArrayModel.evaluator(trigger, "[1, [2, 3]]");
            expect(result).toEqual([1, 2, 3]);
        });

        it("JSON string object should extract keys", () => {
            const result = flattenArrayModel.evaluator(trigger, '{"a": 1, "b": 2}');
            expect(result.sort()).toEqual(["a", "b"]);
        });

        it("invalid JSON string should wrap the string in array", () => {
            const result = flattenArrayModel.evaluator(trigger, "not json");
            expect(result).toEqual(["not json"]);
        });

        it("JSON string with whitespace should be parsed", () => {
            const result = flattenArrayModel.evaluator(trigger, "  [1, 2, 3]  ");
            expect(result).toEqual([1, 2, 3]);
        });

        it("JSON string with complex nested structure", () => {
            const result = flattenArrayModel.evaluator(
                trigger,
                '[[1, [2]], {"a": [3, 4]}]'
            );
            expect(result.sort()).toEqual([1, 2, "a"]);
        });
    });

    describe("special cases", () => {
        it("array with null elements should preserve null", () => {
            const result = flattenArrayModel.evaluator(trigger, [1, null, 2]);
            expect(result).toEqual([1, null, 2]);
        });

        it("array with undefined elements should preserve undefined", () => {
            const result = flattenArrayModel.evaluator(trigger, [1, undefined, 2]);
            expect(result).toEqual([1, undefined, 2]);
        });

        it("array with empty arrays should remove them", () => {
            const result = flattenArrayModel.evaluator(trigger, [1, [], 2]);
            expect(result).toEqual([1, 2]);
        });

        it("array with empty objects should remove them", () => {
            const result = flattenArrayModel.evaluator(trigger, [1, {}, 2]);
            expect(result).toEqual([1, 2]);
        });

        it("deeply nested empty arrays should be removed", () => {
            const result = flattenArrayModel.evaluator(trigger, [
                [[]],
                [1],
                [[]]
            ]);
            expect(result).toEqual([1]);
        });

        it("array with mixed empty and full structures", () => {
            const result = flattenArrayModel.evaluator(trigger, [
                [],
                [1, [2, []]],
                {},
                3
            ]);
            expect(result).toEqual([1, 2, 3]);
        });
    });

    describe("edge case - no input parameter", () => {
        it("no input parameter should return empty array", () => {
            const result = flattenArrayModel.evaluator(trigger);
            expect(result).toEqual([]);
        });
    });
});
