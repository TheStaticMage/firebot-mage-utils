import type { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import model from "../miles-to-meters";

describe("milesToMeters variable", () => {
    let mockTrigger: Effects.Trigger;

    beforeEach(() => {
        mockTrigger = {} as Effects.Trigger;
    });

    describe("basic conversions", () => {
        it("returns 0.00 for 0 miles", () => {
            expect(model.evaluator(mockTrigger, 0)).toBe("0.00");
        });

        it("returns 1609.34 for exactly 1 mile", () => {
            expect(model.evaluator(mockTrigger, 1)).toBe("1609.34");
        });

        it("returns 3218.69 for exactly 2 miles", () => {
            expect(model.evaluator(mockTrigger, 2)).toBe("3218.69");
        });

        it("returns 804.67 for half a mile", () => {
            expect(model.evaluator(mockTrigger, 0.5)).toBe("804.67");
        });

        it("returns correct value for marathon distance in miles", () => {
            // 26.2188 miles * 1609.344 = 42195.07 meters
            expect(model.evaluator(mockTrigger, 26.2188)).toBe("42195.07");
        });

        it("returns negative result for negative miles", () => {
            expect(model.evaluator(mockTrigger, -1)).toBe("-1609.34");
        });
    });

    describe("string inputs", () => {
        it("accepts numeric string input", () => {
            expect(model.evaluator(mockTrigger, "1")).toBe("1609.34");
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
