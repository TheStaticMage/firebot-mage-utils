import type { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import type { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { parseFiniteNumericParam } from "./common";

const EARTH_RADIUS_METERS = 6371000;

function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

const model: ReplaceVariable = {
    definition: {
        handle: "haversineDistance",
        usage: "haversineDistance[lat1, lon1, lat2, lon2]",
        description: "Returns the distance in meters between two geographic coordinates using the Haversine formula, rounded to 2 decimal places. Latitudes must be in [-90, 90] and longitudes in [-180, 180]. Returns empty string for invalid or out-of-range inputs.",
        categories: ["advanced"],
        possibleDataOutput: ["text"],
        examples: [
            {
                usage: "haversineDistance[40.7128, -74.006, 34.0522, -118.2437]",
                description: "Returns the distance in meters between New York and Los Angeles"
            }
        ]
    },
    evaluator: (
        trigger: Effects.Trigger,
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

        const dLat = toRadians(pLat2 - pLat1);
        const dLon = toRadians(pLon2 - pLon1);
        const rLat1 = toRadians(pLat1);
        const rLat2 = toRadians(pLat2);

        const a = Math.sin(dLat / 2) ** 2
            + Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return (EARTH_RADIUS_METERS * c).toFixed(2);
    }
};

export default model;
