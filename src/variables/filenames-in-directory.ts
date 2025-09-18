import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import { ReplaceVariable } from '@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager';
import { firebot, logger } from "../main";

const model : ReplaceVariable = {
    definition: {
        handle: "filenamesInDirectory",
        usage: 'filenamesInDirectory[c:/path/to/directory]',
        description: "Returns an array of filenames in the specified directory. Returns just the filenames, not subdirectories and not the full path. Optionally, a regexp filter and flags can be provided to filter the results. Optionally, the extensions can be stripped.",
        examples: [
            {
                usage: "filenamesInDirectory[c:/path/to/directory]",
                description: "Lists all files in the directory"
            },
            {
                usage: "filenamesInDirectory[c:/path/to/directory, regexp]",
                description: "Lists files matching the regexp filter"
            },
            {
                usage: "filenamesInDirectory[c:/path/to/directory, regexp, flags]",
                description: "Lists files matching the regexp filter, passing flags to regexp filter"
            },
            {
                usage: "filenamesInDirectory[c:/path/to/directory, regexp, flags, true]",
                description: "Lists files matching the regexp filter, passing flags to regexp filter, and strips the extensions from the filenames"
            }
        ],
        categories: ["advanced"],
        possibleDataOutput: ["array"]
    },
    evaluator: (trigger: Effects.Trigger, dirpath: string, filter: string| null = null, flags = "", stripExtension = false) => {
        if (typeof dirpath !== 'string' || dirpath === '') {
            return [];
        }

        const { fs } = firebot.modules;

        try {
            const dirList = fs.readdirSync(dirpath, { "withFileTypes": true });
            let result = dirList.filter(dirent => dirent.isFile()).map(dirent => dirent.name);

            if (typeof filter === 'string' && filter !== '') {
                const regexFilter = new RegExp(String(filter), String(flags));
                result = result.filter(name => regexFilter.test(name));
            }

            if (stripExtension) {
                result = result.map((name) => {
                    const parts = name.split('.');
                    if (parts.length > 1) {
                        parts.pop();
                        return parts.join('.');
                    }
                    return name;
                });
            }

            return result;
        } catch (err) {
            logger.error(`Error reading directory in filenamesInDirectory variable: dirpath=${dirpath} filter=${filter} flags=${flags}: ${err}`);
            return ["[Invalid Directory Path]"];
        }
    }
};

export default model;
