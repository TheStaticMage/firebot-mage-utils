import type { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import model from "../haversine-distance";

describe("haversineDistance variable", () => {
    let mockTrigger: Effects.Trigger;

    beforeEach(() => {
        mockTrigger = {} as Effects.Trigger;
    });

    describe("known distances", () => {
        it("returns 0.00 for the same point", () => {
            expect(model.evaluator(mockTrigger, 0, 0, 0, 0)).toBe("0.00");
        });

        it("returns correct distance for 1 degree of longitude at the equator", () => {
            expect(model.evaluator(mockTrigger, 0, 0, 0, 1)).toBe("111194.93");
        });

        it("returns correct distance for 1 degree of latitude", () => {
            expect(model.evaluator(mockTrigger, 0, 0, 1, 0)).toBe("111194.93");
        });

        it("returns half-circumference for antipodal points", () => {
            expect(model.evaluator(mockTrigger, 0, 0, 0, 180)).toBe("20015086.80");
        });

        it("returns full meridian half-circumference for pole to pole", () => {
            expect(model.evaluator(mockTrigger, 90, 0, -90, 0)).toBe("20015086.80");
        });

        it("returns 0.00 for the same meridian at opposite sign longitudes", () => {
            expect(model.evaluator(mockTrigger, 0, -180, 0, 180)).toBe("0.00");
        });

        it("returns correct distance from London to Paris", () => {
            expect(model.evaluator(mockTrigger, 51.5074, -0.1278, 48.8566, 2.3522)).toBe("343556.06");
        });

        it("returns correct distance from NYC to LA", () => {
            expect(model.evaluator(mockTrigger, 40.7128, -74.006, 34.0522, -118.2437)).toBe("3935746.25");
        });
    });

    describe("string inputs", () => {
        it("accepts string numeric inputs", () => {
            expect(model.evaluator(mockTrigger, "0", "0", "0", "0")).toBe("0.00");
        });

        it("accepts mixed string and number inputs", () => {
            expect(model.evaluator(mockTrigger, 0, "0", 0, "1")).toBe("111194.93");
        });
    });

    describe("out-of-range inputs", () => {
        it("returns empty string when lat1 exceeds 90", () => {
            expect(model.evaluator(mockTrigger, 91, 0, 0, 0)).toBe("");
        });

        it("returns empty string when lat1 is below -90", () => {
            expect(model.evaluator(mockTrigger, -91, 0, 0, 0)).toBe("");
        });

        it("returns empty string when lon1 exceeds 180", () => {
            expect(model.evaluator(mockTrigger, 0, 181, 0, 0)).toBe("");
        });

        it("returns empty string when lon1 is below -180", () => {
            expect(model.evaluator(mockTrigger, 0, -181, 0, 0)).toBe("");
        });

        it("returns empty string when lat2 exceeds 90", () => {
            expect(model.evaluator(mockTrigger, 0, 0, 91, 0)).toBe("");
        });

        it("returns empty string when lon2 exceeds 180", () => {
            expect(model.evaluator(mockTrigger, 0, 0, 0, 181)).toBe("");
        });
    });

    describe("invalid inputs", () => {
        it("returns empty string when lat1 is undefined", () => {
            expect(model.evaluator(mockTrigger, undefined, 0, 0, 0)).toBe("");
        });

        it("returns empty string when lon1 is undefined", () => {
            expect(model.evaluator(mockTrigger, 0, undefined, 0, 0)).toBe("");
        });

        it("returns empty string when lat2 is undefined", () => {
            expect(model.evaluator(mockTrigger, 0, 0, undefined, 0)).toBe("");
        });

        it("returns empty string when lon2 is undefined", () => {
            expect(model.evaluator(mockTrigger, 0, 0, 0, undefined)).toBe("");
        });

        it("returns empty string for non-numeric lat1", () => {
            expect(model.evaluator(mockTrigger, "abc", 0, 0, 0)).toBe("");
        });

        it("returns empty string for non-numeric lon2", () => {
            expect(model.evaluator(mockTrigger, 0, 0, 0, "abc")).toBe("");
        });

        it("returns empty string for NaN input", () => {
            expect(model.evaluator(mockTrigger, NaN, 0, 0, 0)).toBe("");
        });

        it("returns empty string for whitespace-only input", () => {
            expect(model.evaluator(mockTrigger, "   ", 0, 0, 0)).toBe("");
        });

        it("returns empty string for Infinity input", () => {
            expect(model.evaluator(mockTrigger, Infinity, 0, 0, 0)).toBe("");
        });
    });
});
