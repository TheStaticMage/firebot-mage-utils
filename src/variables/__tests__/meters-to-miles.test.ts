import type { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import model from "../meters-to-miles";

describe("metersToMiles variable", () => {
    let mockTrigger: Effects.Trigger;

    beforeEach(() => {
        mockTrigger = {} as Effects.Trigger;
    });

    describe("basic conversions", () => {
        it("returns 0.00 for 0 meters", () => {
            expect(model.evaluator(mockTrigger, 0)).toBe("0.00");
        });

        it("returns 1.00 for exactly 1 mile in meters", () => {
            expect(model.evaluator(mockTrigger, 1609.344)).toBe("1.00");
        });

        it("returns 2.00 for exactly 2 miles in meters", () => {
            expect(model.evaluator(mockTrigger, 3218.688)).toBe("2.00");
        });

        it("returns 0.50 for half a mile in meters", () => {
            expect(model.evaluator(mockTrigger, 804.672)).toBe("0.50");
        });

        it("returns 0.62 for 1000 meters", () => {
            expect(model.evaluator(mockTrigger, 1000)).toBe("0.62");
        });

        it("returns 26.22 for a marathon distance", () => {
            expect(model.evaluator(mockTrigger, 42195)).toBe("26.22");
        });

        it("returns negative result for negative meters", () => {
            expect(model.evaluator(mockTrigger, -1609.344)).toBe("-1.00");
        });
    });

    describe("string inputs", () => {
        it("accepts numeric string input", () => {
            expect(model.evaluator(mockTrigger, "1609.344")).toBe("1.00");
        });

        it("accepts integer string input", () => {
            expect(model.evaluator(mockTrigger, "1000")).toBe("0.62");
        });
    });

    describe("invalid inputs", () => {
        it("returns empty string for undefined", () => {
            expect(model.evaluator(mockTrigger, undefined)).toBe("");
        });

        it("returns empty string for null", () => {
            expect(model.evaluator(mockTrigger, null as unknown as undefined)).toBe("");
        });

        it("returns empty string for empty string", () => {
            expect(model.evaluator(mockTrigger, "")).toBe("");
        });

        it("returns empty string for non-numeric string", () => {
            expect(model.evaluator(mockTrigger, "abc")).toBe("");
        });

        it("returns empty string for NaN", () => {
            expect(model.evaluator(mockTrigger, NaN)).toBe("");
        });

        it("returns empty string for whitespace-only string", () => {
            expect(model.evaluator(mockTrigger, "   ")).toBe("");
        });

        it("returns empty string for Infinity", () => {
            expect(model.evaluator(mockTrigger, Infinity)).toBe("");
        });
    });
});
