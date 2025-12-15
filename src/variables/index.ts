import { firebot } from '../main';
import closestMatch from './closest-match';
import fileNameWithExtension from './file-name-with-extension';
import filenamesInDirectory from './filenames-in-directory';
import formatUSD from './format-usd';
import uFuzzyMatch from './ufuzzy-match';

export function registerReplaceVariables() {
    const { replaceVariableManager } = firebot.modules;

    replaceVariableManager.registerReplaceVariable(closestMatch);
    replaceVariableManager.registerReplaceVariable(filenamesInDirectory);
    replaceVariableManager.registerReplaceVariable(fileNameWithExtension);
    replaceVariableManager.registerReplaceVariable(formatUSD);
    replaceVariableManager.registerReplaceVariable(uFuzzyMatch);
}
