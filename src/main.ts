import { Firebot, RunRequest } from '@crowbartools/firebot-custom-scripts-types';
import { Logger } from '@crowbartools/firebot-custom-scripts-types/types/modules/logger';
import { registerReplaceVariables } from './variables';

export let firebot: RunRequest<any>;
export let logger: LogWrapper;

const scriptVersion = '0.0.4';

const script: Firebot.CustomScript<any> = {
    getScriptManifest: () => {
        return {
            name: "TheStaticMage's Utilities",
            description: "TheStaticMage's utility library for Firebot Custom Scripts.",
            author: "The Static Mage",
            version: scriptVersion,
            startupOnly: true,
            firebotVersion: "5"
        };
    },
    getDefaultParameters: () => {
        return {};
    },
    parametersUpdated: () => {
        // No parameters to update
    },
    run: (runRequest) => {
        firebot = runRequest;
        logger = new LogWrapper(runRequest.modules.logger);
        logger.info(`TheStaticMage's Utilities v${scriptVersion} initializing...`);
        registerReplaceVariables();
        logger.info(`TheStaticMage's Utilities v${scriptVersion} initialized.`);
    }
};

class LogWrapper {
    private _logger: Logger;

    constructor(inLogger: Logger) {
        this._logger = inLogger;
    }

    info(message: string) {
        this._logger.info(`[firebot-mage-utils] ${message}`);
    }

    error(message: string) {
        this._logger.error(`[firebot-mage-utils] ${message}`);
    }

    debug(message: string) {
        this._logger.debug(`[firebot-mage-utils] ${message}`);
    }

    warn(message: string) {
        this._logger.warn(`[firebot-mage-utils] ${message}`);
    }
}

export default script;
