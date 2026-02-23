import { firebot } from '../main';
import closestMatch from './closest-match';
import ensureArray from './ensure-array';
import fileNameWithExtension from './file-name-with-extension';
import filenamesInDirectory from './filenames-in-directory';
import flattenArray from './flatten-array';
import formatUSD from './format-usd';
import streamUptime from './stream-uptime';
import uFuzzyMatch from './ufuzzy-match';

export function registerReplaceVariables() {
    const { replaceVariableManager } = firebot.modules;

    replaceVariableManager.registerReplaceVariable(closestMatch);
    replaceVariableManager.registerReplaceVariable(ensureArray);
    replaceVariableManager.registerReplaceVariable(filenamesInDirectory);
    replaceVariableManager.registerReplaceVariable(fileNameWithExtension);
    replaceVariableManager.registerReplaceVariable(flattenArray);
    replaceVariableManager.registerReplaceVariable(formatUSD);
    replaceVariableManager.registerReplaceVariable(streamUptime);
    replaceVariableManager.registerReplaceVariable(uFuzzyMatch);
}
