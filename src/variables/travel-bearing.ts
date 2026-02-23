import type { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import type { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { parseFiniteNumericParam } from "./common";

function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

const model: ReplaceVariable = {
    definition: {
        handle: "travelBearing",
        usage: "travelBearing[lat1, lon1, lat2, lon2]",
        description: "Returns the initial bearing in degrees (0-360) from one geographic coordinate to another, where 0 is north, 90 is east, 180 is south, and 270 is west. Rounded to 2 decimal places. Returns empty string for invalid or out-of-range inputs.",
        categories: ["advanced"],
        possibleDataOutput: ["text"],
        examples: [
            {
                usage: "travelBearing[40.7128, -74.006, 51.5074, -0.1278]",
                description: "Returns the bearing in degrees from New York to London"
            }
        ]
    },
    evaluator: (
        _trigger: Effects.Trigger,
        lat1?: string | number,
        lon1?: string | number,
        lat2?: string | number,
        lon2?: string | number
    ): string => {
        const pLat1 = parseFiniteNumericParam(lat1);
        const pLon1 = parseFiniteNumericParam(lon1);
        const pLat2 = parseFiniteNumericParam(lat2);
        const pLon2 = parseFiniteNumericParam(lon2);

        if (pLat1 === null || pLon1 === null || pLat2 === null || pLon2 === null) {
            return "";
        }
        if (pLat1 < -90 || pLat1 > 90 || pLat2 < -90 || pLat2 > 90) {
            return "";
        }
        if (pLon1 < -180 || pLon1 > 180 || pLon2 < -180 || pLon2 > 180) {
            return "";
        }

        const rLat1 = toRadians(pLat1);
        const rLat2 = toRadians(pLat2);
        const dLon = toRadians(pLon2 - pLon1);

        const x = Math.sin(dLon) * Math.cos(rLat2);
        const y = Math.cos(rLat1) * Math.sin(rLat2) - Math.sin(rLat1) * Math.cos(rLat2) * Math.cos(dLon);
        const bearing = (Math.atan2(x, y) * 180 / Math.PI + 360) % 360;

        return bearing.toFixed(2);
    }
};

export default model;
