import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import { ReplaceVariable } from '@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager';

const model: ReplaceVariable = {
    definition: {
        handle: "formatUSD",
        usage: 'formatUSD[amount, divisor, useCommas]',
        description: "Converts a number to US dollar currency format. Optionally divides by a divisor before formatting. Optionally adds thousands separators.",
        categories: ["advanced"],
        possibleDataOutput: ["text"],
        examples: [
            {
                usage: 'formatUSD[1234.5]',
                description: "Formats 1234.5 as $1234.50"
            },
            {
                usage: 'formatUSD[2500, 100]',
                description: "Divides 2500 by 100 and formats the result as $25.00"
            },
            {
                usage: 'formatUSD[1234.5, 1, true]',
                description: "Formats 1234.5 with thousands separators as $1,234.50"
            }
        ]
    },
    evaluator: (
        trigger: Effects.Trigger,
        amount?: string | number,
        divisor?: string | number,
        useCommas?: boolean | string
    ): string => {
        const cleanAmount = typeof amount === 'string'
            ? amount.replace(/[^0-9.-]/g, '').replace(/(?!^)-/g, '').replace(/\.(?=.*\.)/g, '')
            : amount;
        const numAmount = Number(cleanAmount);
        const parsedAmount = isNaN(numAmount) ? 0 : numAmount;

        const cleanDivisor = typeof divisor === 'string'
            ? divisor.replace(/[^0-9.-]/g, '').replace(/(?!^)-/g, '').replace(/\.(?=.*\.)/g, '')
            : divisor;
        let numDivisor = Number(cleanDivisor);
        numDivisor = isNaN(numDivisor) ? 1 : numDivisor;
        numDivisor = numDivisor === 0 ? 1 : numDivisor;

        const result = parsedAmount / numDivisor;
        const formatted = result.toFixed(2);

        const shouldUseCommas = useCommas === true || useCommas === 'true';

        if (shouldUseCommas) {
            const [integerPart, decimalPart] = formatted.split('.');
            const isNegative = integerPart.startsWith('-');
            const absInteger = isNegative ? integerPart.slice(1) : integerPart;
            const withCommas = absInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return `$${isNegative ? '-' : ''}${withCommas}.${decimalPart}`;
        }

        return `$${formatted}`;
    }
};

export default model;
