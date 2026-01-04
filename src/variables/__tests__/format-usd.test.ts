import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import model from '../format-usd';

describe('formatUSD variable', () => {
    let mockTrigger: Effects.Trigger;

    beforeEach(() => {
        mockTrigger = {} as Effects.Trigger;
    });

    describe('evaluator function', () => {
        describe('basic currency formatting', () => {
            it('should format integer as USD', () => {
                const result = model.evaluator(mockTrigger, 420);
                expect(result).toBe('$420.00');
            });

            it('should format decimal as USD with two decimal places', () => {
                const result = model.evaluator(mockTrigger, 420.69);
                expect(result).toBe('$420.69');
            });

            it('should format small decimal as USD', () => {
                const result = model.evaluator(mockTrigger, 0.69);
                expect(result).toBe('$0.69');
            });

            it('should format zero as USD', () => {
                const result = model.evaluator(mockTrigger, 0);
                expect(result).toBe('$0.00');
            });

            it('should format negative number as USD', () => {
                const result = model.evaluator(mockTrigger, -50.25);
                expect(result).toBe('$-50.25');
            });

            it('should format small negative decimal as USD', () => {
                const result = model.evaluator(mockTrigger, -0.69);
                expect(result).toBe('$-0.69');
            });

            it('should round to two decimal places', () => {
                const result = model.evaluator(mockTrigger, 123.456);
                expect(result).toBe('$123.46');
            });

            it('should round down when third decimal is less than 5', () => {
                const result = model.evaluator(mockTrigger, 99.994);
                expect(result).toBe('$99.99');
            });

            it('should round up when third decimal is 5 or more', () => {
                const result = model.evaluator(mockTrigger, 99.995);
                expect(result).toBe('$100.00');
            });
        });

        describe('rounding edge cases', () => {
            it('should round 0.001 down to $0.00', () => {
                const result = model.evaluator(mockTrigger, 0.001);
                expect(result).toBe('$0.00');
            });

            it('should round 0.004 down to $0.00', () => {
                const result = model.evaluator(mockTrigger, 0.004);
                expect(result).toBe('$0.00');
            });

            it('should round 0.005 up to $0.01', () => {
                const result = model.evaluator(mockTrigger, 0.005);
                expect(result).toBe('$0.01');
            });

            it('should round 0.009 up to $0.01', () => {
                const result = model.evaluator(mockTrigger, 0.009);
                expect(result).toBe('$0.01');
            });

            it('should round 1.234 down to $1.23', () => {
                const result = model.evaluator(mockTrigger, 1.234);
                expect(result).toBe('$1.23');
            });

            it('should round 1.235 up to $1.24', () => {
                const result = model.evaluator(mockTrigger, 1.235);
                expect(result).toBe('$1.24');
            });

            it('should round 1.236 up to $1.24', () => {
                const result = model.evaluator(mockTrigger, 1.236);
                expect(result).toBe('$1.24');
            });

            it('should round 9.999 up to $10.00', () => {
                const result = model.evaluator(mockTrigger, 9.999);
                expect(result).toBe('$10.00');
            });

            it('should round 99.994 down to $99.99', () => {
                const result = model.evaluator(mockTrigger, 99.994);
                expect(result).toBe('$99.99');
            });

            it('should round 99.996 up to $100.00', () => {
                const result = model.evaluator(mockTrigger, 99.996);
                expect(result).toBe('$100.00');
            });

            it('should round division result 10/3 to $3.33', () => {
                const result = model.evaluator(mockTrigger, 10, 3);
                expect(result).toBe('$3.33');
            });

            it('should round division result 20/3 to $6.67', () => {
                const result = model.evaluator(mockTrigger, 20, 3);
                expect(result).toBe('$6.67');
            });

            it('should round division result 1/3 to $0.33', () => {
                const result = model.evaluator(mockTrigger, 1, 3);
                expect(result).toBe('$0.33');
            });

            it('should round division result 2/3 to $0.67', () => {
                const result = model.evaluator(mockTrigger, 2, 3);
                expect(result).toBe('$0.67');
            });

            it('should round division result 100/7 to $14.29', () => {
                const result = model.evaluator(mockTrigger, 100, 7);
                expect(result).toBe('$14.29');
            });

            it('should round division result 1/6 to $0.17', () => {
                const result = model.evaluator(mockTrigger, 1, 6);
                expect(result).toBe('$0.17');
            });

            it('should round division result 5/6 to $0.83', () => {
                const result = model.evaluator(mockTrigger, 5, 6);
                expect(result).toBe('$0.83');
            });

            it('should round negative number -1.235 to $-1.24', () => {
                const result = model.evaluator(mockTrigger, -1.235);
                expect(result).toBe('$-1.24');
            });

            it('should round negative number -1.234 to $-1.23', () => {
                const result = model.evaluator(mockTrigger, -1.234);
                expect(result).toBe('$-1.23');
            });

            it('should round negative division -10/3 to $-3.33', () => {
                const result = model.evaluator(mockTrigger, -10, 3);
                expect(result).toBe('$-3.33');
            });

            it('should handle float precision (0.1 + 0.2)', () => {
                const result = model.evaluator(mockTrigger, 0.1 + 0.2);
                expect(result).toBe('$0.30');
            });

            it('should handle float precision (0.7 + 0.1)', () => {
                const result = model.evaluator(mockTrigger, 0.7 + 0.1);
                expect(result).toBe('$0.80');
            });

            it('should round very small positive number 0.00001 to $0.00', () => {
                const result = model.evaluator(mockTrigger, 0.00001);
                expect(result).toBe('$0.00');
            });

            it('should round very small negative number -0.00001 to $-0.00', () => {
                const result = model.evaluator(mockTrigger, -0.00001);
                expect(result).toBe('$-0.00');
            });
        });

        describe('string number conversion', () => {
            it('should convert string number to USD', () => {
                const result = model.evaluator(mockTrigger, '420.69');
                expect(result).toBe('$420.69');
            });

            it('should convert string integer to USD', () => {
                const result = model.evaluator(mockTrigger, '100');
                expect(result).toBe('$100.00');
            });

            it('should handle string with leading whitespace', () => {
                const result = model.evaluator(mockTrigger, '  50.25');
                expect(result).toBe('$50.25');
            });

            it('should handle string with trailing whitespace', () => {
                const result = model.evaluator(mockTrigger, '75.50  ');
                expect(result).toBe('$75.50');
            });

            it('should handle string with both leading and trailing whitespace', () => {
                const result = model.evaluator(mockTrigger, '  99.99  ');
                expect(result).toBe('$99.99');
            });

            it('should handle string with dollar sign prefix', () => {
                const result = model.evaluator(mockTrigger, '$420.69');
                expect(result).toBe('$420.69');
            });

            it('should handle string with dollar sign and whitespace', () => {
                const result = model.evaluator(mockTrigger, '  $50.00  ');
                expect(result).toBe('$50.00');
            });

            it('should handle string with only dollar sign', () => {
                const result = model.evaluator(mockTrigger, '$');
                expect(result).toBe('$0.00');
            });

            it('should handle string with dollar sign and invalid text', () => {
                const result = model.evaluator(mockTrigger, '$abc');
                expect(result).toBe('$0.00');
            });

            it('should handle string with commas in input', () => {
                const result = model.evaluator(mockTrigger, '1,234.56');
                expect(result).toBe('$1234.56');
            });

            it('should handle string with commas and dollar sign', () => {
                const result = model.evaluator(mockTrigger, '$1,234.56');
                expect(result).toBe('$1234.56');
            });

            it('should handle string with commas, spaces, and dollar sign', () => {
                const result = model.evaluator(mockTrigger, '  $1,234.56  ');
                expect(result).toBe('$1234.56');
            });

            it('should handle large number with commas as string', () => {
                const result = model.evaluator(mockTrigger, '1,000,000.00');
                expect(result).toBe('$1000000.00');
            });
        });

        describe('division by divisor', () => {
            it('should divide amount by divisor', () => {
                const result = model.evaluator(mockTrigger, 100, 2);
                expect(result).toBe('$50.00');
            });

            it('should divide and format with proper rounding', () => {
                const result = model.evaluator(mockTrigger, 10, 3);
                expect(result).toBe('$3.33');
            });

            it('should handle string divisor', () => {
                const result = model.evaluator(mockTrigger, 100, '4');
                expect(result).toBe('$25.00');
            });

            it('should handle decimal divisor', () => {
                const result = model.evaluator(mockTrigger, 100, 2.5);
                expect(result).toBe('$40.00');
            });

            it('should handle large divisor', () => {
                const result = model.evaluator(mockTrigger, 1000, 100);
                expect(result).toBe('$10.00');
            });

            it('should handle divisor less than 1', () => {
                const result = model.evaluator(mockTrigger, 50, 0.5);
                expect(result).toBe('$100.00');
            });

            it('should handle both amount and divisor as strings', () => {
                const result = model.evaluator(mockTrigger, '100', '5');
                expect(result).toBe('$20.00');
            });
        });

        describe('edge cases for invalid inputs', () => {
            it('should treat undefined amount as 0', () => {
                const result = model.evaluator(mockTrigger, undefined);
                expect(result).toBe('$0.00');
            });

            it('should treat null amount as 0', () => {
                const result = model.evaluator(mockTrigger, null as any);
                expect(result).toBe('$0.00');
            });

            it('should treat empty string amount as 0', () => {
                const result = model.evaluator(mockTrigger, '');
                expect(result).toBe('$0.00');
            });

            it('should treat non-numeric string as 0', () => {
                const result = model.evaluator(mockTrigger, 'abc');
                expect(result).toBe('$0.00');
            });

            it('should treat invalid object as 0', () => {
                const result = model.evaluator(mockTrigger, {} as any);
                expect(result).toBe('$0.00');
            });

            it('should treat array as 0', () => {
                const result = model.evaluator(mockTrigger, [] as any);
                expect(result).toBe('$0.00');
            });

            it('should treat NaN as 0', () => {
                const result = model.evaluator(mockTrigger, NaN);
                expect(result).toBe('$0.00');
            });

            it('should treat Infinity as amount', () => {
                const result = model.evaluator(mockTrigger, Infinity);
                expect(result).toBe('$Infinity');
            });

            it('should treat negative Infinity as amount', () => {
                const result = model.evaluator(mockTrigger, -Infinity);
                expect(result).toBe('$-Infinity');
            });
        });

        describe('edge cases for invalid divisor', () => {
            it('should treat undefined divisor as 1', () => {
                const result = model.evaluator(mockTrigger, 100, undefined);
                expect(result).toBe('$100.00');
            });

            it('should treat null divisor as 1', () => {
                const result = model.evaluator(mockTrigger, 100, null as any);
                expect(result).toBe('$100.00');
            });

            it('should treat empty string divisor as 1', () => {
                const result = model.evaluator(mockTrigger, 100, '');
                expect(result).toBe('$100.00');
            });

            it('should treat non-numeric string divisor as 1', () => {
                const result = model.evaluator(mockTrigger, 100, 'xyz');
                expect(result).toBe('$100.00');
            });

            it('should treat zero divisor as 1', () => {
                const result = model.evaluator(mockTrigger, 100, 0);
                expect(result).toBe('$100.00');
            });

            it('should treat string zero divisor as 1', () => {
                const result = model.evaluator(mockTrigger, 100, '0');
                expect(result).toBe('$100.00');
            });

            it('should treat NaN divisor as 1', () => {
                const result = model.evaluator(mockTrigger, 100, NaN);
                expect(result).toBe('$100.00');
            });

            it('should treat invalid object divisor as 1', () => {
                const result = model.evaluator(mockTrigger, 100, {} as any);
                expect(result).toBe('$100.00');
            });

            it('should treat array divisor as 1', () => {
                const result = model.evaluator(mockTrigger, 100, [] as any);
                expect(result).toBe('$100.00');
            });

            it('should handle negative divisor', () => {
                const result = model.evaluator(mockTrigger, 100, -2);
                expect(result).toBe('$-50.00');
            });

            it('should handle negative amount with negative divisor (double negative)', () => {
                const result = model.evaluator(mockTrigger, -100, -2);
                expect(result).toBe('$50.00');
            });

            it('should handle string negative amount', () => {
                const result = model.evaluator(mockTrigger, '-50.25');
                expect(result).toBe('$-50.25');
            });

            it('should handle string negative divisor', () => {
                const result = model.evaluator(mockTrigger, 100, '-4');
                expect(result).toBe('$-25.00');
            });

            it('should handle string negative amount with dollar sign', () => {
                const result = model.evaluator(mockTrigger, '-$99.99');
                expect(result).toBe('$-99.99');
            });

            it('should handle string with dollar sign after negative', () => {
                const result = model.evaluator(mockTrigger, '-$25.50');
                expect(result).toBe('$-25.50');
            });
        });

        describe('combined edge cases', () => {
            it('should handle both amount and divisor as invalid', () => {
                const result = model.evaluator(mockTrigger, 'abc', 'xyz');
                expect(result).toBe('$0.00');
            });

            it('should handle both amount and divisor as null', () => {
                const result = model.evaluator(mockTrigger, null as any, null as any);
                expect(result).toBe('$0.00');
            });

            it('should handle both amount and divisor as undefined', () => {
                const result = model.evaluator(mockTrigger, undefined, undefined);
                expect(result).toBe('$0.00');
            });

            it('should handle invalid amount with valid divisor', () => {
                const result = model.evaluator(mockTrigger, 'invalid', 2);
                expect(result).toBe('$0.00');
            });

            it('should handle valid amount with invalid divisor', () => {
                const result = model.evaluator(mockTrigger, 100, 'invalid');
                expect(result).toBe('$100.00');
            });

            it('should handle zero amount with zero divisor', () => {
                const result = model.evaluator(mockTrigger, 0, 0);
                expect(result).toBe('$0.00');
            });
        });

        describe('real-world scenarios', () => {
            it('should format cents to dollars', () => {
                const result = model.evaluator(mockTrigger, 42069, 100);
                expect(result).toBe('$420.69');
            });

            it('should format large amounts', () => {
                const result = model.evaluator(mockTrigger, 1000000);
                expect(result).toBe('$1000000.00');
            });

            it('should format very small amounts', () => {
                const result = model.evaluator(mockTrigger, 0.01);
                expect(result).toBe('$0.01');
            });

            it('should handle precision in division', () => {
                const result = model.evaluator(mockTrigger, 100, 3);
                expect(result).toBe('$33.33');
            });

            it('should handle typical streamer donation', () => {
                const result = model.evaluator(mockTrigger, '5.00');
                expect(result).toBe('$5.00');
            });

            it('should handle bits to dollars conversion (100 bits = $1)', () => {
                const result = model.evaluator(mockTrigger, 1000, 100);
                expect(result).toBe('$10.00');
            });

            it('should handle partial bits conversion', () => {
                const result = model.evaluator(mockTrigger, 150, 100);
                expect(result).toBe('$1.50');
            });
        });

        describe('thousands separator (useCommas)', () => {
            it('should format without commas by default', () => {
                const result = model.evaluator(mockTrigger, 1234.5);
                expect(result).toBe('$1234.50');
            });

            it('should format without commas when useCommas is false', () => {
                const result = model.evaluator(mockTrigger, 1234.5, 1, false);
                expect(result).toBe('$1234.50');
            });

            it('should format without commas when useCommas is undefined', () => {
                const result = model.evaluator(mockTrigger, 1234.5, 1, undefined);
                expect(result).toBe('$1234.50');
            });

            it('should format with commas when useCommas is true', () => {
                const result = model.evaluator(mockTrigger, 1234.5, 1, true);
                expect(result).toBe('$1,234.50');
            });

            it('should format with commas when useCommas is string "true"', () => {
                const result = model.evaluator(mockTrigger, 1234.5, 1, 'true');
                expect(result).toBe('$1,234.50');
            });

            it('should format thousands (1,000)', () => {
                const result = model.evaluator(mockTrigger, 1000, 1, true);
                expect(result).toBe('$1,000.00');
            });

            it('should format tens of thousands (10,000)', () => {
                const result = model.evaluator(mockTrigger, 10000, 1, true);
                expect(result).toBe('$10,000.00');
            });

            it('should format hundreds of thousands (100,000)', () => {
                const result = model.evaluator(mockTrigger, 100000, 1, true);
                expect(result).toBe('$100,000.00');
            });

            it('should format millions (1,000,000)', () => {
                const result = model.evaluator(mockTrigger, 1000000, 1, true);
                expect(result).toBe('$1,000,000.00');
            });

            it('should format tens of millions (10,000,000)', () => {
                const result = model.evaluator(mockTrigger, 10000000, 1, true);
                expect(result).toBe('$10,000,000.00');
            });

            it('should format hundreds of millions (100,000,000)', () => {
                const result = model.evaluator(mockTrigger, 100000000, 1, true);
                expect(result).toBe('$100,000,000.00');
            });

            it('should format billions (1,000,000,000)', () => {
                const result = model.evaluator(mockTrigger, 1000000000, 1, true);
                expect(result).toBe('$1,000,000,000.00');
            });

            it('should format tens of billions (10,000,000,000)', () => {
                const result = model.evaluator(mockTrigger, 10000000000, 1, true);
                expect(result).toBe('$10,000,000,000.00');
            });

            it('should format hundreds of billions (100,000,000,000)', () => {
                const result = model.evaluator(mockTrigger, 100000000000, 1, true);
                expect(result).toBe('$100,000,000,000.00');
            });

            it('should format trillions (1,000,000,000,000)', () => {
                const result = model.evaluator(mockTrigger, 1000000000000, 1, true);
                expect(result).toBe('$1,000,000,000,000.00');
            });

            it('should format specific amount ($123,456.78)', () => {
                const result = model.evaluator(mockTrigger, 123456.78, 1, true);
                expect(result).toBe('$123,456.78');
            });

            it('should format specific amount ($987,654,321.99)', () => {
                const result = model.evaluator(mockTrigger, 987654321.99, 1, true);
                expect(result).toBe('$987,654,321.99');
            });

            it('should format amount less than 1000 without comma ($999.99)', () => {
                const result = model.evaluator(mockTrigger, 999.99, 1, true);
                expect(result).toBe('$999.99');
            });

            it('should format amount less than 100 without comma ($99.99)', () => {
                const result = model.evaluator(mockTrigger, 99.99, 1, true);
                expect(result).toBe('$99.99');
            });

            it('should format amount less than 10 without comma ($9.99)', () => {
                const result = model.evaluator(mockTrigger, 9.99, 1, true);
                expect(result).toBe('$9.99');
            });

            it('should format zero with commas enabled ($0.00)', () => {
                const result = model.evaluator(mockTrigger, 0, 1, true);
                expect(result).toBe('$0.00');
            });

            it('should format negative thousands with commas ($-1,234.56)', () => {
                const result = model.evaluator(mockTrigger, -1234.56, 1, true);
                expect(result).toBe('$-1,234.56');
            });

            it('should format negative millions with commas ($-1,000,000.00)', () => {
                const result = model.evaluator(mockTrigger, -1000000, 1, true);
                expect(result).toBe('$-1,000,000.00');
            });

            it('should format negative billions with commas ($-5,432,109,876.54)', () => {
                const result = model.evaluator(mockTrigger, -5432109876.54, 1, true);
                expect(result).toBe('$-5,432,109,876.54');
            });

            it('should work with division and commas', () => {
                const result = model.evaluator(mockTrigger, 100000, 2, true);
                expect(result).toBe('$50,000.00');
            });

            it('should work with string amount and commas', () => {
                const result = model.evaluator(mockTrigger, '5000', 1, true);
                expect(result).toBe('$5,000.00');
            });

            it('should work with dollar sign in string and commas', () => {
                const result = model.evaluator(mockTrigger, '$12345.67', 1, true);
                expect(result).toBe('$12,345.67');
            });

            it('should handle rounding with commas', () => {
                const result = model.evaluator(mockTrigger, 1234.567, 1, true);
                expect(result).toBe('$1,234.57');
            });

            it('should handle division with rounding and commas', () => {
                const result = model.evaluator(mockTrigger, 10000, 3, true);
                expect(result).toBe('$3,333.33');
            });
        });
    });
});
