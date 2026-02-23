import type { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import type { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { parseFiniteNumericParam } from "./common";

const DIRECTIONS_8 = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
const DIRECTIONS_16 = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

const model: ReplaceVariable = {
    definition: {
        handle: "degreesToDirection",
        usage: "degreesToDirection[degrees, subDirections]",
        description: "Converts a bearing in degrees to a compass direction abbreviation. Returns 8-point directions (N, NE, E, SE, S, SW, W, NW) by default. Pass true as the second argument to enable 16-point mode, which adds NNE, ENE, ESE, SSE, SSW, WSW, WNW, and NNW. Accepts any numeric value; normalizes via modulo 360. Returns empty string for invalid input.",
        categories: ["advanced"],
        possibleDataOutput: ["text"],
        examples: [
            {
                usage: "degreesToDirection[45]",
                description: "Returns NE"
            },
            {
                usage: "degreesToDirection[45, true]",
                description: "Returns NE (16-point mode)"
            },
            {
                usage: "degreesToDirection[22.5, true]",
                description: "Returns NNE (16-point mode)"
            }
        ]
    },
    evaluator: (
        trigger: Effects.Trigger,
        degrees?: string | number,
        subDirections?: boolean | string
    ): string => {
        const deg = parseFiniteNumericParam(degrees);
        if (deg === null) {
            return "";
        }

        const normalized = ((deg % 360) + 360) % 360;
        const useSubDirections = subDirections === true || subDirections === "true";

        if (useSubDirections) {
            const index = Math.round(normalized / 22.5) % 16;
            return DIRECTIONS_16[index];
        }

        const index = Math.round(normalized / 45) % 8;
        return DIRECTIONS_8[index];
    }
};

export default model;
