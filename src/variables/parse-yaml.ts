import type { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import type { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import * as yaml from "js-yaml";

/**
 * Creates an error sentinel object for YAML parsing failures.
 * @param message - The error message to include.
 * @returns JSON string with parse-yaml-error key.
 */
function createErrorSentinel(message: string): string {
    return JSON.stringify({ "parse-yaml-error": message });
}

const model: ReplaceVariable = {
    definition: {
        handle: "parseYAML",
        usage: "parseYAML[args...]",
        description: "Parses YAML arguments and outputs JSON string.",
        categories: ["advanced"],
        possibleDataOutput: ["text"]
    },
    evaluator: (trigger: Effects.Trigger, ...args: string[]): string => {
        if (!args || args.length === 0) {
            return createErrorSentinel("No arguments provided");
        }

        const yamlString = args.join("\n");
        const trimmed = yamlString.trim();

        if (trimmed === "") {
            return createErrorSentinel("No arguments provided");
        }

        try {
            const parsed = yaml.load(trimmed);
            return JSON.stringify(parsed);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return createErrorSentinel(errorMessage);
        }
    }
};

export default model;
