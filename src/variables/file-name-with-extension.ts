import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import { ReplaceVariable } from '@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager';
import { firebot, logger } from "../main";

const model : ReplaceVariable = {
    definition: {
        handle: "fileNameWithExtension",
        usage: 'fileNameWithExtension[c:/path/to/directory, filename]',
        description: "Finds the file 'filename' in the provided directory, and returns it with its extension if any (e.g. 'filename.mp3'). Only returns actual files, never directories.",
        categories: ["advanced"],
        possibleDataOutput: ["text"]
    },
    evaluator: (
        trigger: Effects.Trigger,
        filePath?: string,
        filename?: string
    ) : string => {
        if (!filePath || !filename) {
            return "";
        }

        const { fs, path } = firebot.modules;

        try {
            const dirFiles = fs.readdirSync(filePath);
            if (dirFiles.includes(filename)) {
                const exactPath = path.join(filePath, filename);
                if (fs.existsSync(exactPath) && fs.statSync(exactPath).isFile()) {
                    return filename;
                }
            }

            const matches = dirFiles.filter(f => f.startsWith(`${filename}.`));
            for (const match of matches) {
                const candidatePath = path.join(filePath, match);
                if (fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile()) {
                    return match;
                }
            }

            return "";
        } catch (err) {
            logger.error(`Error reading directory in fileNameWithExtension variable: filePath=${filePath} filename=${filename}: ${err}`);
            return "";
        }
    }
};

export default model;
