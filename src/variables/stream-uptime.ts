import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import { ReplaceVariable } from '@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager';
import { firebot, logger } from "../main";

const model: ReplaceVariable = {
    definition: {
        handle: "streamUptime",
        usage: "streamUptime",
        description: "Returns the current Twitch stream uptime in seconds. Returns -1 when the stream is not live or the data is unavailable.",
        categories: ["advanced"],
        possibleDataOutput: ["text"]
    },
    evaluator: async (_trigger: Effects.Trigger): Promise<string> => {
        const { twitchApi } = firebot.modules;

        if (!twitchApi?.streams?.getStreamersCurrentStream) {
            logger.debug("streamUptime: twitchApi is not available.");
            return "-1";
        }

        try {
            const stream = await twitchApi.streams.getStreamersCurrentStream();

            if (stream == null) {
                return "-1";
            }

            const startDate = stream.startDate;
            if (!(startDate instanceof Date) || Number.isNaN(startDate.getTime())) {
                logger.debug("streamUptime: stream startDate is missing or invalid.");
                return "-1";
            }

            const uptimeSeconds = Math.floor((Date.now() - startDate.getTime()) / 1000);
            return String(uptimeSeconds);
        } catch (err) {
            logger.debug(`streamUptime: failed to fetch stream uptime: ${err}`);
            return "-1";
        }
    }
};

export default model;
