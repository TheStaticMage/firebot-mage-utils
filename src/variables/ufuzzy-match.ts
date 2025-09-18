import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import { ReplaceVariable } from '@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager';
import { fuzzyPreprocess, matchResult } from "./common";
import { logger } from "../main";
const uFuzzy = require("@leeoniya/ufuzzy");

const model : ReplaceVariable = {
    definition: {
        handle: "uFuzzyMatch",
        usage: 'uFuzzyMatch[needle, haystack]',
        description: "Finds the closest match in the haystack for the provided needle via uFuzzy (https://github.com/leeoniya/uFuzzy).",
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

        const preprocessed = fuzzyPreprocess(text, array);
        if (preprocessed !== null) {
            return preprocessed;
        }

        const needle = text.trim().toLocaleLowerCase();
        const haystack = array.map(a => a.toLocaleLowerCase());

        // Taken from Grafana's fuzzy search implementation
        // https://github.com/grafana/grafana/blob/main/packages/grafana-data/src/utils/fuzzySearch.ts
        // https://github.com/grafana/grafana/tree/main?tab=AGPL-3.0-1-ov-file#readme
        // Grafana is AGPLv3 and this is GPLv3
        const REGEXP_NON_ASCII = /[^ -~]/m;
        // https://www.asciitable.com/
        // matches only these: `~!@#$%^&*()_+-=[]\{}|;':",./<>?
        const REGEXP_ONLY_SYMBOLS = /^[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]+$/m;
        // limit max terms in needle that qualify for re-ordering
        const outOfOrderLimit = 5;
        // beyond 25 chars fall back to substring search
        const maxNeedleLength = 25;
        // beyond 5 terms fall back to substring match
        const maxFuzzyTerms = 5;
        // when number of matches <= 1e4, do ranking + sorting by quality
        const rankThreshold = 1e4;

        // eslint-disable-next-line new-cap
        const uf = new uFuzzy({ intraMode: 1 });
        if (REGEXP_NON_ASCII.test(needle) || REGEXP_ONLY_SYMBOLS.test(needle) || needle.length > maxNeedleLength || uf.split(needle).length > maxFuzzyTerms) {
            const needleRegex = new RegExp(needle.replace(/[\\^$*+?.()|[\]{}/]/g, '\\$&'), 'i');
            for (const item of array) {
                if (needleRegex.test(item)) {
                    return matchResult(item, array);
                }
            }
            return "";
        }

        const [idxs, info, order] = uf.search(haystack, needle, outOfOrderLimit, rankThreshold);

        if (idxs?.length) {
            if (info && order) {
                return matchResult(haystack[info.idx[order[0]]], array);
            }

            logger.error("uFuzzy: missing info/order in result despite idxs being present");
            return "";
        }

        const haystackPreview = haystack.length > 10
            ? `${JSON.stringify(haystack.slice(0, 10))}, ...`
            : JSON.stringify(haystack);
        logger.debug(`uFuzzy: no matches found (needle: "${needle}", haystack: ${haystackPreview})`);
        return "";
    }
};

export default model;
