import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import { ReplaceVariable } from '@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager';
import { closestMatch } from 'closest-match';

const model : ReplaceVariable = {
    definition: {
        handle: "closestMatch",
        usage: 'closestMatch[text, array]',
        description: "Finds the closest match in the array for the provided text using the Levenshtein distance.",
        categories: ["advanced"],
        possibleDataOutput: ["text"]
    },
    evaluator: (
        trigger: Effects.Trigger,
        text?: string,
        array?: string[]
    ) : string => {
        if (!text || !array || typeof text !== "string" || !Array.isArray(array) || array.length === 0 || text.trim() === "") {
            return "";
        }

        const normalizedText = text.trim().toLocaleLowerCase();
        const normalizedArray = array.map(a => a.toLocaleLowerCase());

        // Check for exact match first
        const exactMatchIndex = normalizedArray.indexOf(normalizedText);
        if (exactMatchIndex >= 0) {
            return array[exactMatchIndex];
        }

        const result = closestMatch(normalizedText, normalizedArray);

        if (Array.isArray(result)) {
            if (result.length > 0) {
                const matchIndex = normalizedArray.indexOf(result[0]);
                return matchIndex >= 0 ? array[matchIndex] : "";
            }
            return "";
        }
        if (typeof result === "string") {
            const matchIndex = normalizedArray.indexOf(result);
            return matchIndex >= 0 ? array[matchIndex] : "";
        }
        return "";
    }
};

export default model;
