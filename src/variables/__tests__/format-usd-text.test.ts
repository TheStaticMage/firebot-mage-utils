import type { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import model from "../format-usd-text";

const mockTrigger = {} as unknown as Effects.Trigger;

describe("formatUSDText variable", () => {
    describe("definition", () => {
        it("should have correct handle", () => {
            expect(model.definition.handle).toBe("formatUSDText");
        });

        it("should have correct usage", () => {
            expect(model.definition.usage).toBe("formatUSDText[amount, divisor]");
        });

        it("should have categories", () => {
            expect(model.definition.categories).toContain("advanced");
        });

        it("should have text as possible data output", () => {
            expect(model.definition.possibleDataOutput).toContain("text");
        });

        it("should have examples", () => {
            expect(model.definition.examples).toBeDefined();
            expect(model.definition.examples).toBeDefined();
            expect(model.definition.examples?.length).toBeGreaterThan(0);
        });
    });

    describe("evaluator function", () => {
        describe("basic ones (0-19)", () => {
            it("should convert zero to words", () => {
                const result = model.evaluator(mockTrigger, 0);
                expect(result).toBe("zero dollars");
            });

            it("should convert one to words", () => {
                const result = model.evaluator(mockTrigger, 1);
                expect(result).toBe("one dollar");
            });

            it("should convert one with correct singular", () => {
                const result = model.evaluator(mockTrigger, 1.0);
                expect(result).toBe("one dollar");
            });

            it("should convert two to words", () => {
                const result = model.evaluator(mockTrigger, 2);
                expect(result).toBe("two dollars");
            });

            it("should convert five to words", () => {
                const result = model.evaluator(mockTrigger, 5);
                expect(result).toBe("five dollars");
            });

            it("should convert nine to words", () => {
                const result = model.evaluator(mockTrigger, 9);
                expect(result).toBe("nine dollars");
            });

            it("should convert ten to words", () => {
                const result = model.evaluator(mockTrigger, 10);
                expect(result).toBe("ten dollars");
            });

            it("should convert eleven to words", () => {
                const result = model.evaluator(mockTrigger, 11);
                expect(result).toBe("eleven dollars");
            });

            it("should convert fifteen to words", () => {
                const result = model.evaluator(mockTrigger, 15);
                expect(result).toBe("fifteen dollars");
            });

            it("should convert nineteen to words", () => {
                const result = model.evaluator(mockTrigger, 19);
                expect(result).toBe("nineteen dollars");
            });
        });

        describe("tens and compound numbers (20-99)", () => {
            it("should convert twenty to words", () => {
                const result = model.evaluator(mockTrigger, 20);
                expect(result).toBe("twenty dollars");
            });

            it("should convert twenty-one with hyphen", () => {
                const result = model.evaluator(mockTrigger, 21);
                expect(result).toBe("twenty-one dollars");
            });

            it("should convert twenty-nine with hyphen", () => {
                const result = model.evaluator(mockTrigger, 29);
                expect(result).toBe("twenty-nine dollars");
            });

            it("should convert thirty to words", () => {
                const result = model.evaluator(mockTrigger, 30);
                expect(result).toBe("thirty dollars");
            });

            it("should convert thirty-five with hyphen", () => {
                const result = model.evaluator(mockTrigger, 35);
                expect(result).toBe("thirty-five dollars");
            });

            it("should convert fifty to words", () => {
                const result = model.evaluator(mockTrigger, 50);
                expect(result).toBe("fifty dollars");
            });

            it("should convert fifty-five with hyphen", () => {
                const result = model.evaluator(mockTrigger, 55);
                expect(result).toBe("fifty-five dollars");
            });

            it("should convert ninety to words", () => {
                const result = model.evaluator(mockTrigger, 90);
                expect(result).toBe("ninety dollars");
            });

            it("should convert ninety-nine with hyphen", () => {
                const result = model.evaluator(mockTrigger, 99);
                expect(result).toBe("ninety-nine dollars");
            });
        });

        describe("hundreds (100-999)", () => {
            it("should convert one hundred to words", () => {
                const result = model.evaluator(mockTrigger, 100);
                expect(result).toBe("one hundred dollars");
            });

            it("should convert one hundred one to words", () => {
                const result = model.evaluator(mockTrigger, 101);
                expect(result).toBe("one hundred one dollars");
            });

            it("should convert one hundred twenty-three to words", () => {
                const result = model.evaluator(mockTrigger, 123);
                expect(result).toBe("one hundred twenty-three dollars");
            });

            it("should convert two hundred to words", () => {
                const result = model.evaluator(mockTrigger, 200);
                expect(result).toBe("two hundred dollars");
            });

            it("should convert five hundred fifty-five to words", () => {
                const result = model.evaluator(mockTrigger, 555);
                expect(result).toBe("five hundred fifty-five dollars");
            });

            it("should convert nine hundred ninety-nine to words", () => {
                const result = model.evaluator(mockTrigger, 999);
                expect(result).toBe("nine hundred ninety-nine dollars");
            });
        });

        describe("thousands (1000-999999)", () => {
            it("should convert one thousand to words", () => {
                const result = model.evaluator(mockTrigger, 1000);
                expect(result).toBe("one thousand dollars");
            });

            it("should convert one thousand one to words", () => {
                const result = model.evaluator(mockTrigger, 1001);
                expect(result).toBe("one thousand one dollars");
            });

            it("should convert one thousand two hundred thirty-four to words", () => {
                const result = model.evaluator(mockTrigger, 1234);
                expect(result).toBe("one thousand two hundred thirty-four dollars");
            });

            it("should convert ten thousand to words", () => {
                const result = model.evaluator(mockTrigger, 10000);
                expect(result).toBe("ten thousand dollars");
            });

            it("should convert one hundred thousand to words", () => {
                const result = model.evaluator(mockTrigger, 100000);
                expect(result).toBe("one hundred thousand dollars");
            });

            it("should convert four hundred twenty thousand to words", () => {
                const result = model.evaluator(mockTrigger, 420000);
                expect(result).toBe("four hundred twenty thousand dollars");
            });

            it("should convert nine hundred ninety-nine thousand nine hundred ninety-nine to words", () => {
                const result = model.evaluator(mockTrigger, 999999);
                expect(result).toBe(
                    "nine hundred ninety-nine thousand nine hundred ninety-nine dollars"
                );
            });
        });

        describe("millions (1000000-999999999)", () => {
            it("should convert one million to words", () => {
                const result = model.evaluator(mockTrigger, 1000000);
                expect(result).toBe("one million dollars");
            });

            it("should convert one million one to words", () => {
                const result = model.evaluator(mockTrigger, 1000001);
                expect(result).toBe("one million one dollars");
            });

            it("should convert one million two hundred thirty-four thousand five hundred sixty-seven to words", () => {
                const result = model.evaluator(mockTrigger, 1234567);
                expect(result).toBe(
                    "one million two hundred thirty-four thousand five hundred sixty-seven dollars"
                );
            });

            it("should convert ten million to words", () => {
                const result = model.evaluator(mockTrigger, 10000000);
                expect(result).toBe("ten million dollars");
            });

            it("should convert one hundred million to words", () => {
                const result = model.evaluator(mockTrigger, 100000000);
                expect(result).toBe("one hundred million dollars");
            });

            it("should convert nine hundred ninety-nine million nine hundred ninety-nine thousand nine hundred ninety-nine to words", () => {
                const result = model.evaluator(mockTrigger, 999999999);
                expect(result).toBe(
                    "nine hundred ninety-nine million nine hundred ninety-nine thousand nine hundred ninety-nine dollars"
                );
            });
        });

        describe("billions (1000000000-999999999999)", () => {
            it("should convert one billion to words", () => {
                const result = model.evaluator(mockTrigger, 1000000000);
                expect(result).toBe("one billion dollars");
            });

            it("should convert one billion one to words", () => {
                const result = model.evaluator(mockTrigger, 1000000001);
                expect(result).toBe("one billion one dollars");
            });

            it("should convert ten billion to words", () => {
                const result = model.evaluator(mockTrigger, 10000000000);
                expect(result).toBe("ten billion dollars");
            });

            it("should convert one hundred billion to words", () => {
                const result = model.evaluator(mockTrigger, 100000000000);
                expect(result).toBe("one hundred billion dollars");
            });
        });

        describe("trillions (1000000000000-10000000000000)", () => {
            it("should convert one trillion to words", () => {
                const result = model.evaluator(mockTrigger, 1000000000000);
                expect(result).toBe("one trillion dollars");
            });

            it("should convert five trillion to words", () => {
                const result = model.evaluator(mockTrigger, 5000000000000);
                expect(result).toBe("five trillion dollars");
            });

            it("should convert ten trillion to words", () => {
                const result = model.evaluator(mockTrigger, 10000000000000);
                expect(result).toBe("ten trillion dollars");
            });

            it("should convert nine trillion nine hundred ninety-nine billion... to words", () => {
                const result = model.evaluator(mockTrigger, 9999999999999);
                expect(result).toBe(
                    "nine trillion nine hundred ninety-nine billion nine hundred ninety-nine million nine hundred ninety-nine thousand nine hundred ninety-nine dollars"
                );
            });
        });

        describe("decimal/cents handling", () => {
            it("should include cents when present", () => {
                const result = model.evaluator(mockTrigger, 1.01);
                expect(result).toBe("one dollar and one cent");
            });

            it('should use singular "cent" for one cent', () => {
                const result = model.evaluator(mockTrigger, 0.01);
                expect(result).toBe("one cent");
            });

            it('should use plural "cents" for multiple cents', () => {
                const result = model.evaluator(mockTrigger, 0.25);
                expect(result).toBe("twenty-five cents");
            });

            it("should convert 0.4 dollars to 40 cents", () => {
                const result = model.evaluator(mockTrigger, 0.4);
                expect(result).toBe("forty cents");
            });

            it("should convert 69 cents to words", () => {
                const result = model.evaluator(mockTrigger, 0.69);
                expect(result).toBe("sixty-nine cents");
            });

            it("should convert 99 cents to words", () => {
                const result = model.evaluator(mockTrigger, 0.99);
                expect(result).toBe("ninety-nine cents");
            });

            it("should omit cents when zero", () => {
                const result = model.evaluator(mockTrigger, 100.0);
                expect(result).toBe("one hundred dollars");
            });

            it("should omit zero cents for compound amounts", () => {
                const result = model.evaluator(mockTrigger, 420.0);
                expect(result).toBe("four hundred twenty dollars");
            });

            it("should include cents in compound amounts", () => {
                const result = model.evaluator(mockTrigger, 420.69);
                expect(result).toBe("four hundred twenty dollars and sixty-nine cents");
            });

            it("should handle single cent", () => {
                const result = model.evaluator(mockTrigger, 5.01);
                expect(result).toBe("five dollars and one cent");
            });

            it("should handle high cents with compound dollars", () => {
                const result = model.evaluator(mockTrigger, 1234.56);
                expect(result).toBe(
                    "one thousand two hundred thirty-four dollars and fifty-six cents"
                );
            });
        });

        describe("negative numbers", () => {
            it('should prefix negative one dollar with "negative"', () => {
                const result = model.evaluator(mockTrigger, -1);
                expect(result).toBe("negative one dollar");
            });

            it('should prefix negative two dollars with "negative"', () => {
                const result = model.evaluator(mockTrigger, -2);
                expect(result).toBe("negative two dollars");
            });

            it('should prefix negative hundreds with "negative"', () => {
                const result = model.evaluator(mockTrigger, -100);
                expect(result).toBe("negative one hundred dollars");
            });

            it("should prefix negative hundreds with cents", () => {
                const result = model.evaluator(mockTrigger, -200.4);
                expect(result).toBe("negative two hundred dollars and forty cents");
            });

            it("should handle negative with one cent", () => {
                const result = model.evaluator(mockTrigger, -0.01);
                expect(result).toBe("negative one cent");
            });

            it('should prefix negative millions with "negative"', () => {
                const result = model.evaluator(mockTrigger, -5000000);
                expect(result).toBe("negative five million dollars");
            });

            it("should prefix negative with all scale words", () => {
                const result = model.evaluator(mockTrigger, -1234567890);
                expect(result).toBe(
                    "negative one billion two hundred thirty-four million five hundred sixty-seven thousand eight hundred ninety dollars"
                );
            });

            it("should handle negative ten trillion", () => {
                const result = model.evaluator(mockTrigger, -10000000000000);
                expect(result).toBe("negative ten trillion dollars");
            });

            it("should return 'zero dollars' for negative zero", () => {
                const result = model.evaluator(mockTrigger, -0);
                expect(result).toBe("zero dollars");
            });

            it("should return 'zero dollars' for negative zero string", () => {
                const result = model.evaluator(mockTrigger, "-0.00");
                expect(result).toBe("zero dollars");
            });

            it("should return 'zero dollars' for zero with negative divisor", () => {
                const result = model.evaluator(mockTrigger, 0, -2);
                expect(result).toBe("zero dollars");
            });
        });

        describe("divisor parameter", () => {
            it("should divide amount by divisor", () => {
                const result = model.evaluator(mockTrigger, 100, 2);
                expect(result).toBe("fifty dollars");
            });

            it("should divide 10000 by 100 to get 100 dollars", () => {
                const result = model.evaluator(mockTrigger, 10000, 100);
                expect(result).toBe("one hundred dollars");
            });

            it("should divide with cents result", () => {
                const result = model.evaluator(mockTrigger, 100, 3);
                expect(result).toBe("thirty-three dollars and thirty-three cents");
            });

            it("should divide to produce cents", () => {
                const result = model.evaluator(mockTrigger, 25, 100);
                expect(result).toBe("twenty-five cents");
            });

            it("should handle divisor of one", () => {
                const result = model.evaluator(mockTrigger, 100, 1);
                expect(result).toBe("one hundred dollars");
            });

            it("should handle string divisor", () => {
                const result = model.evaluator(mockTrigger, 100, "2");
                expect(result).toBe("fifty dollars");
            });

            it("should handle decimal divisor", () => {
                const result = model.evaluator(mockTrigger, 100, 2.5);
                expect(result).toBe("forty dollars");
            });
        });

        describe("string input conversion", () => {
            it("should convert string number to words", () => {
                const result = model.evaluator(mockTrigger, "123.45");
                expect(result).toBe(
                    "one hundred twenty-three dollars and forty-five cents"
                );
            });

            it("should convert string integer to words", () => {
                const result = model.evaluator(mockTrigger, "42");
                expect(result).toBe("forty-two dollars");
            });

            it("should handle string with dollar sign", () => {
                const result = model.evaluator(mockTrigger, "$100");
                expect(result).toBe("one hundred dollars");
            });

            it("should handle string with commas", () => {
                const result = model.evaluator(mockTrigger, "1,234.56");
                expect(result).toBe(
                    "one thousand two hundred thirty-four dollars and fifty-six cents"
                );
            });

            it("should handle string with whitespace", () => {
                const result = model.evaluator(mockTrigger, "  100  ");
                expect(result).toBe("one hundred dollars");
            });

            it("should clean string with dollar sign and commas", () => {
                const result = model.evaluator(mockTrigger, "$1,234.56");
                expect(result).toBe(
                    "one thousand two hundred thirty-four dollars and fifty-six cents"
                );
            });

            it("should clean string with negative and dollar sign", () => {
                const result = model.evaluator(mockTrigger, "-$100.00");
                expect(result).toBe("negative one hundred dollars");
            });
        });

        describe("edge cases for invalid inputs", () => {
            it("should treat undefined as zero dollars", () => {
                const result = model.evaluator(mockTrigger, undefined);
                expect(result).toBe("zero dollars");
            });

            it("should treat null as zero dollars", () => {
                // biome-ignore lint/suspicious/noExplicitAny: Needed for this test
                const result = model.evaluator(mockTrigger, null as any);
                expect(result).toBe("zero dollars");
            });

            it("should treat empty string as zero dollars", () => {
                const result = model.evaluator(mockTrigger, "");
                expect(result).toBe("zero dollars");
            });

            it("should treat non-numeric string as zero dollars", () => {
                const result = model.evaluator(mockTrigger, "abc");
                expect(result).toBe("zero dollars");
            });

            it("should treat NaN as zero dollars", () => {
                const result = model.evaluator(mockTrigger, NaN);
                expect(result).toBe("zero dollars");
            });

            it("should use singular 'dollar' for exactly one dollar", () => {
                const result = model.evaluator(mockTrigger, 1.0);
                expect(result).toBe("one dollar");
            });

            it("should use plural 'dollars' for zero dollars", () => {
                const result = model.evaluator(mockTrigger, 0);
                expect(result).toBe("zero dollars");
            });

            it("should use plural 'dollars' for two dollars", () => {
                const result = model.evaluator(mockTrigger, 2.0);
                expect(result).toBe("two dollars");
            });

            it("should return empty string for numbers too large to convert", () => {
                const result = model.evaluator(mockTrigger, 10000000000001);
                expect(result).toBe("");
            });

            it("should return empty string for numbers too small to convert", () => {
                const result = model.evaluator(mockTrigger, -10000000000001);
                expect(result).toBe("");
            });

            it("should work with numbers at the top of the range", () => {
                const result = model.evaluator(mockTrigger, 10000000000000);
                expect(result).toBe("ten trillion dollars");
            });

            it("should work with numbers at the bottom of the range", () => {
                const result = model.evaluator(mockTrigger, -10000000000000);
                expect(result).toBe("negative ten trillion dollars");
            });

            it("should handle 10 trillion minus 1 cent", () => {
                const result = model.evaluator(mockTrigger, 9999999999999.99);
                expect(result).toBe(
                    "nine trillion nine hundred ninety-nine billion nine hundred ninety-nine million nine hundred ninety-nine thousand nine hundred ninety-nine dollars and ninety-nine cents"
                );
            });

            it("should return empty string for just over 10 trillion with cents", () => {
                const result = model.evaluator(mockTrigger, 10000000000000.01);
                expect(result).toBe("");
            });

            it("should return empty string for just under -10 trillion with cents", () => {
                const result = model.evaluator(mockTrigger, -10000000000000.01);
                expect(result).toBe("");
            });
        });

        describe("edge cases for invalid divisor", () => {
            it("should treat undefined divisor as 1", () => {
                const result = model.evaluator(mockTrigger, 100, undefined);
                expect(result).toBe("one hundred dollars");
            });

            it("should treat null divisor as 1", () => {
                // biome-ignore lint/suspicious/noExplicitAny: Needed for this test
                const result = model.evaluator(mockTrigger, 100, null as any);
                expect(result).toBe("one hundred dollars");
            });

            it("should treat zero divisor as 1", () => {
                const result = model.evaluator(mockTrigger, 100, 0);
                expect(result).toBe("one hundred dollars");
            });

            it("should treat non-numeric divisor as 1", () => {
                // biome-ignore lint/suspicious/noExplicitAny: Needed for this test
                const result = model.evaluator(mockTrigger, 100, "abc" as any);
                expect(result).toBe("one hundred dollars");
            });

            it("should handle negative divisor", () => {
                const result = model.evaluator(mockTrigger, 100, -2);
                expect(result).toBe("negative fifty dollars");
            });

            it("should handle double negative (negative amount with negative divisor)", () => {
                const result = model.evaluator(mockTrigger, -100, -2);
                expect(result).toBe("fifty dollars");
            });
        });

        describe("rounding behavior", () => {
            it("should round cents correctly from division", () => {
                const result = model.evaluator(mockTrigger, 20, 3);
                expect(result).toBe("six dollars and sixty-seven cents");
            });

            it("should round 20/3 correctly", () => {
                const result = model.evaluator(mockTrigger, 20, 3);
                expect(result).toBe("six dollars and sixty-seven cents");
            });

            it("should round 1/3 correctly", () => {
                const result = model.evaluator(mockTrigger, 1, 3);
                expect(result).toBe("thirty-three cents");
            });

            it("should round 100/7 correctly", () => {
                const result = model.evaluator(mockTrigger, 100, 7);
                expect(result).toBe("fourteen dollars and twenty-nine cents");
            });

            it("should round up cents when divisor results in 0.5 cents", () => {
                const result = model.evaluator(mockTrigger, 1, 200);
                expect(result).toBe("one cent");
            });
        });

        describe("realistic scenarios", () => {
            it("should handle streamer donation amount", () => {
                const result = model.evaluator(mockTrigger, 420.69);
                expect(result).toBe("four hundred twenty dollars and sixty-nine cents");
            });

            it("should handle bits to dollars (1000 bits / 100 = $10)", () => {
                const result = model.evaluator(mockTrigger, 1000, 100);
                expect(result).toBe("ten dollars");
            });

            it("should handle bits with cents (150 bits / 100 = $1.50)", () => {
                const result = model.evaluator(mockTrigger, 150, 100);
                expect(result).toBe("one dollar and fifty cents");
            });

            it("should handle million dollar amount", () => {
                const result = model.evaluator(mockTrigger, 1000000);
                expect(result).toBe("one million dollars");
            });

            it("should handle large real-world amount", () => {
                const result = model.evaluator(mockTrigger, 123456789.99);
                expect(result).toBe(
                    "one hundred twenty-three million four hundred fifty-six thousand seven hundred eighty-nine dollars and ninety-nine cents"
                );
            });
        });
    });
});
