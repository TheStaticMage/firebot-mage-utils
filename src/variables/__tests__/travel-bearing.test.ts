import type { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import model from "../travel-bearing";

describe("travelBearing variable", () => {
    let mockTrigger: Effects.Trigger;

    beforeEach(() => {
        mockTrigger = {} as Effects.Trigger;
    });

    describe("cardinal bearings", () => {
        it("returns 0.00 for the same point", () => {
            expect(model.evaluator(mockTrigger, 0, 0, 0, 0)).toBe("0.00");
        });

        it("returns 0.00 for due north", () => {
            expect(model.evaluator(mockTrigger, 0, 0, 1, 0)).toBe("0.00");
        });

        it("returns 90.00 for due east", () => {
            expect(model.evaluator(mockTrigger, 0, 0, 0, 1)).toBe("90.00");
        });

        it("returns 180.00 for due south", () => {
            expect(model.evaluator(mockTrigger, 1, 0, 0, 0)).toBe("180.00");
        });

        it("returns 270.00 for due west", () => {
            expect(model.evaluator(mockTrigger, 0, 1, 0, 0)).toBe("270.00");
        });

        it("returns 45.00 for a northeast diagonal", () => {
            expect(model.evaluator(mockTrigger, 0, 0, 1, 1)).toBe("45.00");
        });
    });

    describe("real-world bearings", () => {
        it("returns correct bearing from NYC to London", () => {
            expect(model.evaluator(mockTrigger, 40.7128, -74.006, 51.5074, -0.1278)).toBe("51.21");
        });

        it("returns correct bearing from London to NYC", () => {
            expect(model.evaluator(mockTrigger, 51.5074, -0.1278, 40.7128, -74.006)).toBe("288.33");
        });
    });

    describe("string inputs", () => {
        it("accepts string numeric inputs", () => {
            expect(model.evaluator(mockTrigger, "0", "0", "1", "0")).toBe("0.00");
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
