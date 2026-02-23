import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import ensureArrayModel from "../ensure-array";

const trigger = {} as Effects.Trigger;

describe("ensureArray replace variable", () => {
    describe("already arrays", () => {
        it("array with elements should return unchanged", () => {
            const result = ensureArrayModel.evaluator(trigger, [1, 2, 3]);
            expect(result).toEqual([1, 2, 3]);
        });

        it("empty array should return empty array", () => {
            const result = ensureArrayModel.evaluator(trigger, []);
            expect(result).toEqual([]);
        });

        it("array with mixed types should return unchanged", () => {
            const result = ensureArrayModel.evaluator(trigger, [1, "a", true, null]);
            expect(result).toEqual([1, "a", true, null]);
        });

        it("nested array should return unchanged", () => {
            const result = ensureArrayModel.evaluator(trigger, [[1, 2], [3, 4]]);
            expect(result).toEqual([[1, 2], [3, 4]]);
        });
    });

    describe("null and undefined inputs", () => {
        it("null should return empty array", () => {
            const result = ensureArrayModel.evaluator(trigger, null);
            expect(result).toEqual([]);
        });

        it("undefined should return empty array", () => {
            const result = ensureArrayModel.evaluator(trigger, undefined);
            expect(result).toEqual([]);
        });

        it("no input parameter should return empty array", () => {
            const result = ensureArrayModel.evaluator(trigger);
            expect(result).toEqual([]);
        });
    });

    describe("single primitives wrapped in array", () => {
        it("single string should be wrapped in array", () => {
            const result = ensureArrayModel.evaluator(trigger, "foo");
            expect(result).toEqual(["foo"]);
        });

        it("single number should be wrapped in array", () => {
            const result = ensureArrayModel.evaluator(trigger, 42);
            expect(result).toEqual([42]);
        });

        it("boolean true should be wrapped in array", () => {
            const result = ensureArrayModel.evaluator(trigger, true);
            expect(result).toEqual([true]);
        });

        it("boolean false should be wrapped in array", () => {
            const result = ensureArrayModel.evaluator(trigger, false);
            expect(result).toEqual([false]);
        });

        it("zero should be wrapped in array", () => {
            const result = ensureArrayModel.evaluator(trigger, 0);
            expect(result).toEqual([0]);
        });
    });

    describe("objects apply flatten logic", () => {
        it("simple object should return keys as array", () => {
            const result = ensureArrayModel.evaluator(trigger, { foo: "bar" });
            expect(result.sort()).toEqual(["foo"]);
        });

        it("object with multiple properties should return all keys", () => {
            const result = ensureArrayModel.evaluator(trigger, { a: 1, b: 2, c: 3 });
            expect(result.sort()).toEqual(["a", "b", "c"]);
        });

        it("empty object should return empty array", () => {
            const result = ensureArrayModel.evaluator(trigger, {});
            expect(result).toEqual([]);
        });

        it("nested object should return only top-level keys", () => {
            const result = ensureArrayModel.evaluator(trigger, { a: { b: 1 } });
            expect(result).toEqual(["a"]);
        });
    });

    describe("JSON string input", () => {
        it("JSON string array should be parsed and returned", () => {
            const result = ensureArrayModel.evaluator(trigger, "[1, 2, 3]");
            expect(result).toEqual([1, 2, 3]);
        });

        it("JSON string object should extract keys", () => {
            const result = ensureArrayModel.evaluator(trigger, '{"foo":"bar"}');
            expect(result.sort()).toEqual(["foo"]);
        });

        it("JSON string primitive should be wrapped in array", () => {
            const result = ensureArrayModel.evaluator(trigger, '"hello"');
            expect(result).toEqual(["hello"]);
        });

        it("invalid JSON string should be wrapped in array", () => {
            const result = ensureArrayModel.evaluator(trigger, "not json");
            expect(result).toEqual(["not json"]);
        });
    });

    describe("Map input", () => {
        it("Map should extract keys", () => {
            const map = new Map();
            map.set("key1", 1);
            map.set("key2", 2);
            const result = ensureArrayModel.evaluator(trigger, map);
            expect(result.sort()).toEqual(["key1", "key2"]);
        });

        it("empty Map should return empty array", () => {
            const map = new Map();
            const result = ensureArrayModel.evaluator(trigger, map);
            expect(result).toEqual([]);
        });
    });

    describe("edge cases", () => {
        it("empty string should return empty array (via flatten logic)", () => {
            const result = ensureArrayModel.evaluator(trigger, "");
            expect(result).toEqual([]);
        });

        it("whitespace-only string should return empty array (via flatten logic)", () => {
            const result = ensureArrayModel.evaluator(trigger, "   ");
            expect(result).toEqual([]);
        });

        it("array with null elements should preserve null", () => {
            const result = ensureArrayModel.evaluator(trigger, [1, null, 2]);
            expect(result).toEqual([1, null, 2]);
        });
    });
});
