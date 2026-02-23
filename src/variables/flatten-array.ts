import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";

const MAX_DEPTH = 100;

function flattenValue(
    value: unknown,
    visited = new WeakSet(),
    depth = 0
): unknown[] {
    if (depth > MAX_DEPTH) {
        return [];
    }

    if (value === null) {
        return [null];
    }

    if (value === undefined) {
        return [undefined];
    }

    if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed === "") {
            return [];
        }

        try {
            const parsed = JSON.parse(trimmed);
            return flattenValue(parsed, visited, depth + 1);
        } catch {
            return [value];
        }
    }

    if (Array.isArray(value)) {
        const result: unknown[] = [];
        for (const item of value) {
            const flattened = flattenValue(item, visited, depth + 1);
            result.push(...flattened);
        }
        return result;
    }

    if (value instanceof Map) {
        const result: unknown[] = [];
        for (const key of value.keys()) {
            result.push(key);
        }
        return result;
    }

    if (typeof value === "object" && value !== null) {
        if (visited.has(value)) {
            return [];
        }
        visited.add(value);

        const result: unknown[] = [];
        const keys = Object.keys(value);

        for (const key of keys) {
            result.push(key);
        }
        return result;
    }

    return [value];
}

const model: ReplaceVariable = {
    definition: {
        handle: "flattenArray",
        usage: "flattenArray[input]",
        description:
            "Recursively flattens nested arrays into a single-level array. Converts objects/Maps to their keys. Wraps primitives in an array. Returns [] for null, undefined, or empty strings.",
        categories: ["advanced"],
        possibleDataOutput: ["array"],
        examples: [
            {
                usage: "flattenArray[[1, [2, [3]]]]",
                description: "Returns [1, 2, 3]"
            },
            {
                usage: "flattenArray[{a: 1, b: 2}]",
                description: "Returns ['a', 'b'] (in any order)"
            },
            {
                usage: "flattenArray[42]",
                description: "Returns [42]"
            },
            {
                usage: "flattenArray[null]",
                description: "Returns []"
            }
        ]
    },
    evaluator: (trigger: Effects.Trigger, input?: unknown): unknown[] => {
        if (input === null || input === undefined) {
            return [];
        }
        return flattenValue(input);
    }
};

export default model;
