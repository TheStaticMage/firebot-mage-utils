import { firebot } from '../main';
import closestMatch from './closest-match';
import degreesToDirection from './degrees-to-direction';
import ensureArray from './ensure-array';
import fileNameWithExtension from './file-name-with-extension';
import filenamesInDirectory from './filenames-in-directory';
import flattenArray from './flatten-array';
import formatUSD from './format-usd';
import haversineDistance from './haversine-distance';
import metersToMiles from './meters-to-miles';
import milesToMeters from './miles-to-meters';
import streamUptime from './stream-uptime';
import travelBearing from './travel-bearing';
import uFuzzyMatch from './ufuzzy-match';

export function registerReplaceVariables() {
    const { replaceVariableManager } = firebot.modules;

    replaceVariableManager.registerReplaceVariable(closestMatch);
    replaceVariableManager.registerReplaceVariable(degreesToDirection);
    replaceVariableManager.registerReplaceVariable(ensureArray);
    replaceVariableManager.registerReplaceVariable(filenamesInDirectory);
    replaceVariableManager.registerReplaceVariable(fileNameWithExtension);
    replaceVariableManager.registerReplaceVariable(flattenArray);
    replaceVariableManager.registerReplaceVariable(formatUSD);
    replaceVariableManager.registerReplaceVariable(haversineDistance);
    replaceVariableManager.registerReplaceVariable(metersToMiles);
    replaceVariableManager.registerReplaceVariable(milesToMeters);
    replaceVariableManager.registerReplaceVariable(streamUptime);
    replaceVariableManager.registerReplaceVariable(travelBearing);
    replaceVariableManager.registerReplaceVariable(uFuzzyMatch);
}
