import type { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import parseYamlModel from "../parse-yaml";

const trigger = {} as Effects.Trigger;

describe("parseYAML replace variable", () => {
    describe("simple key-value pairs", () => {
        it("should parse simple key-value to JSON", () => {
            const result = parseYamlModel.evaluator(trigger, "key: value");
            expect(result).toBe('{"key":"value"}');
        });

        it("should parse string value", () => {
            const result = parseYamlModel.evaluator(trigger, "name: TheStaticMage");
            expect(result).toBe('{"name":"TheStaticMage"}');
        });

        it("should parse number value", () => {
            const result = parseYamlModel.evaluator(trigger, "count: 42");
            expect(result).toBe('{"count":42}');
        });

        it("should parse float value", () => {
            const result = parseYamlModel.evaluator(trigger, "price: 19.99");
            expect(result).toBe('{"price":19.99}');
        });

        it("should parse boolean true", () => {
            const result = parseYamlModel.evaluator(trigger, "active: true");
            expect(result).toBe('{"active":true}');
        });

        it("should parse boolean false", () => {
            const result = parseYamlModel.evaluator(trigger, "deleted: false");
            expect(result).toBe('{"deleted":false}');
        });

        it("should parse null value", () => {
            const result = parseYamlModel.evaluator(trigger, "optional: null");
            expect(result).toBe('{"optional":null}');
        });
    });

    describe("multiple arguments concatenated with newlines", () => {
        it("should concatenate two arguments with newline", () => {
            const result = parseYamlModel.evaluator(trigger, "key1: val1", "key2: val2");
            expect(result).toBe('{"key1":"val1","key2":"val2"}');
        });

        it("should concatenate three arguments", () => {
            const result = parseYamlModel.evaluator(trigger, "name: test", "role: admin", "active: true");
            expect(result).toBe('{"name":"test","role":"admin","active":true}');
        });

        it("should handle multi-line structure in single argument", () => {
            const result = parseYamlModel.evaluator(trigger, "key1: val1\nkey2: val2");
            expect(result).toBe('{"key1":"val1","key2":"val2"}');
        });
    });

    describe("arrays and nested structures", () => {
        it("should parse array", () => {
            const result = parseYamlModel.evaluator(trigger, "items: [a, b, c]");
            expect(result).toBe('{"items":["a","b","c"]}');
        });

        it("should parse nested object", () => {
            const result = parseYamlModel.evaluator(trigger, "user: {name: test, role: admin}");
            expect(result).toBe('{"user":{"name":"test","role":"admin"}}');
        });

        it("should parse mixed nested structure", () => {
            const result = parseYamlModel.evaluator(trigger, "name: test", "tags: [a, b]", "meta: {count: 5}");
            expect(result).toBe('{"name":"test","tags":["a","b"],"meta":{"count":5}}');
        });
    });

    describe("empty and missing arguments", () => {
        it("should return error sentinel for no arguments", () => {
            const result = parseYamlModel.evaluator(trigger);
            const parsed = JSON.parse(result);
            expect(parsed).toHaveProperty("parse-yaml-error");
            expect(typeof parsed["parse-yaml-error"]).toBe("string");
        });

        it("should return error sentinel for single empty string", () => {
            const result = parseYamlModel.evaluator(trigger, "");
            const parsed = JSON.parse(result);
            expect(parsed).toHaveProperty("parse-yaml-error");
        });

        it("should return error sentinel for whitespace-only input", () => {
            const result = parseYamlModel.evaluator(trigger, "   ");
            const parsed = JSON.parse(result);
            expect(parsed).toHaveProperty("parse-yaml-error");
        });

        it("should return error sentinel for multiple empty strings", () => {
            const result = parseYamlModel.evaluator(trigger, "", "", "");
            const parsed = JSON.parse(result);
            expect(parsed).toHaveProperty("parse-yaml-error");
        });
    });

    describe("invalid YAML syntax", () => {
        it("should return error sentinel for unclosed bracket", () => {
            const result = parseYamlModel.evaluator(trigger, "key: [unclosed");
            const parsed = JSON.parse(result);
            expect(parsed).toHaveProperty("parse-yaml-error");
        });

        it("should parse valid indented YAML", () => {
            const result = parseYamlModel.evaluator(trigger, "key:\n  bad");
            expect(result).toBe('{"key":"bad"}');
        });

        it("should return error sentinel for invalid syntax", () => {
            const result = parseYamlModel.evaluator(trigger, "invalid: yaml: content: here");
            const parsed = JSON.parse(result);
            expect(parsed).toHaveProperty("parse-yaml-error");
        });

        it("should parse colon without value as null", () => {
            const result = parseYamlModel.evaluator(trigger, "key:");
            expect(result).toBe('{"key":null}');
        });
    });

    describe("error sentinel format", () => {
        it("should return valid JSON string for error", () => {
            const result = parseYamlModel.evaluator(trigger, "invalid: [");
            expect(() => JSON.parse(result)).not.toThrow();
        });

        it("should have exact sentinel key", () => {
            const result = parseYamlModel.evaluator(trigger, "invalid: [");
            const parsed = JSON.parse(result);
            expect(Object.keys(parsed)).toEqual(["parse-yaml-error"]);
        });

        it("should have string error message", () => {
            const result = parseYamlModel.evaluator(trigger, "invalid: [");
            const parsed = JSON.parse(result);
            expect(typeof parsed["parse-yaml-error"]).toBe("string");
        });
    });

    describe("JSON output format", () => {
        it("should return valid JSON string for valid YAML", () => {
            const result = parseYamlModel.evaluator(trigger, "key: value");
            expect(() => JSON.parse(result)).not.toThrow();
        });

        it("should parse back to original structure", () => {
            const result = parseYamlModel.evaluator(trigger, "name: test", "count: 42", "active: true");
            const parsed = JSON.parse(result);
            expect(parsed).toEqual({ name: "test", count: 42, active: true });
        });
    });
});
