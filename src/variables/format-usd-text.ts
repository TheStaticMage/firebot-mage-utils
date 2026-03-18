import type { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import type { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";

// Lookup tables for number-to-words conversion
const ones = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine"
];

const teens = [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen"
];

const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety"
];

const scales = [
    { value: 1000000000000, name: "trillion" },
    { value: 1000000000, name: "billion" },
    { value: 1000000, name: "million" },
    { value: 1000, name: "thousand" }
];

/**
 * Convert a number 0-999 to words
 */
function convertBelowThousand(num: number): string {
    if (num === 0) {
        return "";
    }

    let result = "";

    // Handle hundreds
    const hundreds = Math.floor(num / 100);
    if (hundreds > 0) {
        result += `${ones[hundreds]} hundred`;
        num %= 100;
        if (num > 0) {
            result += " ";
        }
    }

    // Handle tens and ones
    if (num >= 20) {
        result += tens[Math.floor(num / 10)];
        const remainder = num % 10;
        if (remainder > 0) {
            result += `-${ones[remainder]}`;
        }
    } else if (num >= 10) {
        result += teens[num - 10];
    } else if (num > 0) {
        result += ones[num];
    }

    return result;
}

/**
 * Convert a number to its word representation for text-to-speech
 */
function convertToWords(num: number): string {
    if (num === 0) {
        return "zero";
    }

    let result = "";

    // Handle each scale
    for (const scale of scales) {
        const scaleValue = Math.floor(num / scale.value);
        if (scaleValue > 0) {
            if (result) {
                result += " ";
            }
            result += `${convertBelowThousand(scaleValue)} ${scale.name}`;
            num %= scale.value;
        }
    }

    // Handle remaining ones
    if (num > 0) {
        if (result) {
            result += " ";
        }
        result += convertBelowThousand(num);
    }

    return result;
}

/**
 * Parse amount and divisor as strings to preserve precision,
 * then divide and return result as fixed-point string with 2 decimal places.
 */
function divideWithPrecision(
    amountStr: string,
    divisorStr: string
): { result: string; isNegative: boolean } {
    // Remove non-numeric chars except minus, decimal, digits
    const cleanAmount = amountStr.replace(/[^0-9.-]/g, "").replace(/(?!^)-/g, "");
    const cleanDivisor = divisorStr
        .replace(/[^0-9.-]/g, "")
        .replace(/(?!^)-/g, "");

    // Determine if result is negative
    const amountNegative = cleanAmount.startsWith("-");
    const divisorNegative = cleanDivisor.startsWith("-");
    const isNegative = amountNegative !== divisorNegative;

    // Handle divisor of 0 or invalid
    const divisorNum = Number(cleanDivisor);
    if (isNaN(divisorNum) || divisorNum === 0) {
        const amountNum = Number(cleanAmount);
        const absAmount = Math.abs(amountNum);
        return { result: absAmount.toFixed(2), isNegative: amountNum < 0 };
    }

    // Use BigInt for precision: multiply by 100 to get cents, divide, then format
    const absAmountStr = cleanAmount.replace(/^-/, "");
    const absDivisorStr = cleanDivisor.replace(/^-/, "");

    // Parse as cents (multiply by 100)
    const parseToCents = (s: string): bigint => {
        const parts = s.split(".");
        if (parts.length === 1) {
            return BigInt(parts[0] || "0") * BigInt(100);
        }
        const intPart = parts[0] || "0";
        const decPart = parts[1].padEnd(2, "0").slice(0, 2);
        return BigInt(intPart) * BigInt(100) + BigInt(decPart);
    };

    const amountCents = parseToCents(absAmountStr);
    const divisorCents = parseToCents(absDivisorStr);

    // Divide with rounding: (amountCents * 100 * 2 + divisorCents) / (divisorCents * 2)
    const numerator = amountCents * BigInt(200) + divisorCents;
    const denominator = divisorCents * BigInt(2);
    const quotient = numerator / denominator;

    // Format as dollars.cents
    const dollars = quotient / BigInt(100);
    const cents = quotient % BigInt(100);
    const result = `${dollars}.${cents.toString().padStart(2, "0")}`;

    return { result, isNegative };
}

const model: ReplaceVariable = {
    definition: {
        handle: "formatUSDText",
        usage: "formatUSDText[amount, divisor]",
        description:
			"Converts a dollar amount to English words optimized for text-to-speech (TTS). Optionally divides by a divisor before converting. Supports amounts from -10 trillion to 10 trillion inclusive.",
        categories: ["advanced"],
        possibleDataOutput: ["text"],
        examples: [
            {
                usage: "formatUSDText[420.69]",
                description:
					"Converts to: four hundred twenty dollars and sixty-nine cents"
            },
            {
                usage: "formatUSDText[100]",
                description: "Converts to: one hundred dollars"
            },
            {
                usage: "formatUSDText[-200.4]",
                description:
					"Converts to: negative two hundred dollars and forty cents"
            },
            {
                usage: "formatUSDText[10000, 100]",
                description:
					"Divides 10000 by 100 and converts to: one hundred dollars"
            }
        ]
    },
    evaluator: (
        trigger: Effects.Trigger,
        amount?: string | number,
        divisor?: string | number
    ): string => {
        const amountStr = String(amount ?? "");
        const divisorStr = String(divisor ?? "");

        // Handle empty/invalid amount
        if (!amountStr || isNaN(Number(amountStr.replace(/[^0-9.-]/g, "")))) {
            return "zero dollars";
        }

        // Perform division with precision
        const { result: fixedStr, isNegative } = divideWithPrecision(
            amountStr,
            divisorStr
        );

        // Split into dollars and cents
        const [dollarPart, centPart] = fixedStr.split(".");
        const dollars = parseInt(dollarPart, 10);
        const cents = parseInt(centPart, 10);

        // Range validation: supported range is -10 trillion to 10 trillion inclusive
        // 10 trillion = 10,000,000,000,000 = 1,000,000,000,000,000 cents
        const maxDollars = 10000000000000;
        const maxCents = maxDollars * 100;
        const totalCents = Math.abs(dollars) * 100 + cents;
        if (totalCents > maxCents) {
            return "";
        }

        // Special case: only cents (no dollars)
        if (dollars === 0 && cents > 0) {
            let result = convertToWords(cents);
            result += cents === 1 ? " cent" : " cents";
            if (isNegative) {
                result = `negative ${result}`;
            }
            return result;
        }

        // Convert dollars to words
        let result = convertToWords(dollars);

        // Add dollar/dollars
        result += dollars === 1 ? " dollar" : " dollars";

        // Add cents if present
        if (cents > 0) {
            result += ` and ${convertToWords(cents)}`;
            result += cents === 1 ? " cent" : " cents";
        }

        // Add negative prefix if needed (but not for zero)
        if (isNegative && (dollars !== 0 || cents !== 0)) {
            result = `negative ${result}`;
        }

        return result;
    }
};

export default model;
