/**
 * Preprocesses the input string for fuzzy matching against a list of possible matches.
 *
 * - Trims and lowercases the input and matches for normalization.
 * - Returns the original match from the `matches` array if an exact match is found (case-insensitive).
 * - Returns an empty string if the input or matches are invalid or empty.
 * - Returns `null` if no exact match is found.
 *
 * @param input - The string to preprocess and match.
 * @param matches - The array of possible match strings.
 * @returns The original match string if an exact match is found, an empty string for invalid input, or `null` if no match is found.
 */
export function fuzzyPreprocess(input: string, matches: string[]): string | null {
    if (!input || !matches || typeof input !== "string" || !Array.isArray(matches) || matches.length === 0 || input.trim() === "") {
        return "";
    }

    // Check for exact match
    const normalizedInput = input.trim().toLocaleLowerCase();
    const normalizedMatches = matches.map(a => a.toLocaleLowerCase());
    const exactMatchIndex = normalizedMatches.indexOf(normalizedInput);
    if (exactMatchIndex >= 0) {
        return matches[exactMatchIndex];
    }

    return null;
}

export function matchResult(result: string, matches: string[]): string {
    const normalizedMatches = matches.map(a => a.toLocaleLowerCase());
    const matchIndex = normalizedMatches.indexOf(result.toLocaleLowerCase());
    return matchIndex >= 0 ? matches[matchIndex] : "";
}

export function parseFiniteNumericParam(value?: string | number | null): number | null {
    if (value === null || value === undefined) {
        return null;
    }

    if (typeof value === "string" && value.trim() === "") {
        return null;
    }

    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : null;
}
