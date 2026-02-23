import type { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import type { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { parseFiniteNumericParam } from "./common";

const METERS_PER_MILE = 1609.344;

const model: ReplaceVariable = {
    definition: {
        handle: "milesToMeters",
        usage: "milesToMeters[miles]",
        description: "Converts a distance in miles to meters, rounded to 2 decimal places. Returns empty string for invalid input.",
        categories: ["advanced"],
        possibleDataOutput: ["text"],
        examples: [
            {
                usage: "milesToMeters[1]",
                description: "Returns 1609.34"
            },
            {
                usage: "milesToMeters[26.2188]",
                description: "Returns 42195.07 (marathon distance)"
            }
        ]
    },
    evaluator: (trigger: Effects.Trigger, miles?: string | number): string => {
        const mi = parseFiniteNumericParam(miles);
        if (mi === null) {
            return "";
        }
        return (mi * METERS_PER_MILE).toFixed(2);
    }
};

export default model;
