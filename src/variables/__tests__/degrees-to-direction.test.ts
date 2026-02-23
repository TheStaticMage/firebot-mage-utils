import type { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import model from "../degrees-to-direction";

describe("degreesToDirection variable", () => {
    let mockTrigger: Effects.Trigger;

    beforeEach(() => {
        mockTrigger = {} as Effects.Trigger;
    });

    describe("8-point mode (default)", () => {
        it("returns N for 0 degrees", () => {
            expect(model.evaluator(mockTrigger, 0)).toBe("N");
        });

        it("returns N just below the NE boundary", () => {
            expect(model.evaluator(mockTrigger, 22.4)).toBe("N");
        });

        it("returns NE at the NE boundary (22.5)", () => {
            expect(model.evaluator(mockTrigger, 22.5)).toBe("NE");
        });

        it("returns NE at 45 degrees", () => {
            expect(model.evaluator(mockTrigger, 45)).toBe("NE");
        });

        it("returns E at 90 degrees", () => {
            expect(model.evaluator(mockTrigger, 90)).toBe("E");
        });

        it("returns SE at 135 degrees", () => {
            expect(model.evaluator(mockTrigger, 135)).toBe("SE");
        });

        it("returns S at 180 degrees", () => {
            expect(model.evaluator(mockTrigger, 180)).toBe("S");
        });

        it("returns SW at 225 degrees", () => {
            expect(model.evaluator(mockTrigger, 225)).toBe("SW");
        });

        it("returns W at 270 degrees", () => {
            expect(model.evaluator(mockTrigger, 270)).toBe("W");
        });

        it("returns NW at 315 degrees", () => {
            expect(model.evaluator(mockTrigger, 315)).toBe("NW");
        });

        it("returns NW just below the N wrap boundary", () => {
            expect(model.evaluator(mockTrigger, 337.4)).toBe("NW");
        });

        it("returns N at the N wrap boundary (337.5)", () => {
            expect(model.evaluator(mockTrigger, 337.5)).toBe("N");
        });

        it("normalizes 360 to N", () => {
            expect(model.evaluator(mockTrigger, 360)).toBe("N");
        });

        it("normalizes 720 to N via modulo", () => {
            expect(model.evaluator(mockTrigger, 720)).toBe("N");
        });

        it("normalizes -90 to W", () => {
            expect(model.evaluator(mockTrigger, -90)).toBe("W");
        });

        it("uses 8-point mode when second arg is false", () => {
            expect(model.evaluator(mockTrigger, 45, false)).toBe("NE");
        });

        it('uses 8-point mode when second arg is "false"', () => {
            expect(model.evaluator(mockTrigger, 45, "false")).toBe("NE");
        });
    });

    describe('16-point mode (second arg true or "true")', () => {
        it("returns N for 0 degrees", () => {
            expect(model.evaluator(mockTrigger, 0, true)).toBe("N");
        });

        it("returns N just below the NNE boundary", () => {
            expect(model.evaluator(mockTrigger, 11.24, true)).toBe("N");
        });

        it("returns NNE at the NNE boundary (11.25)", () => {
            expect(model.evaluator(mockTrigger, 11.25, true)).toBe("NNE");
        });

        it("returns NE at 33.75 degrees", () => {
            expect(model.evaluator(mockTrigger, 33.75, true)).toBe("NE");
        });

        it("returns ENE at 56.25 degrees", () => {
            expect(model.evaluator(mockTrigger, 56.25, true)).toBe("ENE");
        });

        it("returns E at 78.75 degrees", () => {
            expect(model.evaluator(mockTrigger, 78.75, true)).toBe("E");
        });

        it("returns ESE at 101.25 degrees", () => {
            expect(model.evaluator(mockTrigger, 101.25, true)).toBe("ESE");
        });

        it("returns SE at 123.75 degrees", () => {
            expect(model.evaluator(mockTrigger, 123.75, true)).toBe("SE");
        });

        it("returns SSE at 146.25 degrees", () => {
            expect(model.evaluator(mockTrigger, 146.25, true)).toBe("SSE");
        });

        it("returns S at 168.75 degrees", () => {
            expect(model.evaluator(mockTrigger, 168.75, true)).toBe("S");
        });

        it("returns SSW at 191.25 degrees", () => {
            expect(model.evaluator(mockTrigger, 191.25, true)).toBe("SSW");
        });

        it("returns SW at 213.75 degrees", () => {
            expect(model.evaluator(mockTrigger, 213.75, true)).toBe("SW");
        });

        it("returns WSW at 236.25 degrees", () => {
            expect(model.evaluator(mockTrigger, 236.25, true)).toBe("WSW");
        });

        it("returns W at 258.75 degrees", () => {
            expect(model.evaluator(mockTrigger, 258.75, true)).toBe("W");
        });

        it("returns WNW at 281.25 degrees", () => {
            expect(model.evaluator(mockTrigger, 281.25, true)).toBe("WNW");
        });

        it("returns NW at 303.75 degrees", () => {
            expect(model.evaluator(mockTrigger, 303.75, true)).toBe("NW");
        });

        it("returns NNW at 326.25 degrees", () => {
            expect(model.evaluator(mockTrigger, 326.25, true)).toBe("NNW");
        });

        it("wraps back to N at 348.75 degrees", () => {
            expect(model.evaluator(mockTrigger, 348.75, true)).toBe("N");
        });

        it('accepts "true" as a string', () => {
            expect(model.evaluator(mockTrigger, 90, "true")).toBe("E");
        });
    });

    describe("invalid inputs", () => {
        it("returns empty string for undefined degrees", () => {
            expect(model.evaluator(mockTrigger, undefined)).toBe("");
        });

        it("returns empty string for null degrees", () => {
            expect(model.evaluator(mockTrigger, null as unknown as undefined)).toBe("");
        });

        it("returns empty string for empty string degrees", () => {
            expect(model.evaluator(mockTrigger, "")).toBe("");
        });

        it("returns empty string for non-numeric degrees", () => {
            expect(model.evaluator(mockTrigger, "abc")).toBe("");
        });

        it("returns empty string for NaN degrees", () => {
            expect(model.evaluator(mockTrigger, NaN)).toBe("");
        });

        it("returns empty string for whitespace-only degrees", () => {
            expect(model.evaluator(mockTrigger, "   ")).toBe("");
        });

        it("returns empty string for Infinity degrees", () => {
            expect(model.evaluator(mockTrigger, Infinity)).toBe("");
        });
    });
});
