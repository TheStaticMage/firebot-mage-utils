import type { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import type { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { parseFiniteNumericParam } from "./common";

const METERS_PER_MILE = 1609.344;

const model: ReplaceVariable = {
    definition: {
        handle: "metersToMiles",
        usage: "metersToMiles[meters]",
        description: "Converts a distance in meters to miles, rounded to 2 decimal places. Returns empty string for invalid input.",
        categories: ["advanced"],
        possibleDataOutput: ["text"],
        examples: [
            {
                usage: "metersToMiles[1609.344]",
                description: "Returns 1.00"
            },
            {
                usage: "metersToMiles[42195]",
                description: "Returns 26.22 (marathon distance)"
            }
        ]
    },
    evaluator: (trigger: Effects.Trigger, meters?: string | number): string => {
        const m = parseFiniteNumericParam(meters);
        if (m === null) {
            return "";
        }
        return (m / METERS_PER_MILE).toFixed(2);
    }
};

export default model;
