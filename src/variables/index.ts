import { firebot } from '../main';
import fileNameWithExtension from './file-name-with-extension';
import filenamesInDirectory from './filenames-in-directory';

export function registerReplaceVariables() {
    const { replaceVariableManager } = firebot.modules;

    replaceVariableManager.registerReplaceVariable(fileNameWithExtension);
    replaceVariableManager.registerReplaceVariable(filenamesInDirectory);
}
