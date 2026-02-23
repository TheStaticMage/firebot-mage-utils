import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import flattenArrayModel from "./flatten-array";

const model: ReplaceVariable = {
    definition: {
        handle: "ensureArray",
        usage: "ensureArray[input]",
        description:
            "Ensures the input is an array. If already an array, returns it unchanged. If null or undefined, returns an empty array. If a primitive, wraps it in an array. If an object/Map, applies flatten logic to extract keys.",
        categories: ["advanced"],
        possibleDataOutput: ["array"],
        examples: [
            {
                usage: "ensureArray[[1, 2, 3]]",
                description: "Returns [1, 2, 3] (already array, unchanged)"
            },
            {
                usage: "ensureArray[null]",
                description: "Returns [] (null becomes empty array)"
            },
            {
                usage: "ensureArray[foo]",
                description: "Returns ['foo'] (single value wrapped in array)"
            },
            {
                usage: "ensureArray[{\"foo\":\"bar\"}]",
                description: "Returns ['foo'] (object keys extracted)"
            }
        ]
    },
    evaluator: (trigger: Effects.Trigger, input?: unknown): unknown[] => {
        if (input === null || input === undefined) {
            return [];
        }

        if (Array.isArray(input)) {
            return input;
        }

        const flattened = flattenArrayModel.evaluator(trigger, input);
        return flattened;
    }
};

export default model;
