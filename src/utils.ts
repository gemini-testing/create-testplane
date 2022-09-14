import path from "path";

import { ToolArgv } from "./types/toolArgv";
import { ToolOpts } from "./types/toolOpts";

export const defaultToolOpts: Partial<ToolOpts> = {
    pluginGroups: [
        {
            description: "Plugins group 1",
            plugins: [
                {
                    description: "does something",
                    plugin: "plugin-1-1",
                    default: false,
                },
                {
                    description: "does something else",
                    plugin: "plugin-1-2",
                    default: true,
                },
                {
                    description: "does something too",
                    plugin: "plugin-1-3",
                    default: false,
                },
            ],
        },
        {
            description: "Plugins group 2",
            plugins: [
                {
                    description: "does something fancy",
                    plugin: "plugin-2-1",
                    default: false,
                },
                {
                    description: "does something nice",
                    plugin: "plugin-2-2",
                    default: true,
                },
                {
                    description: "does something good",
                    plugin: "plugin-2-3",
                    default: true,
                },
            ],
        },
    ],
};

export const optsFromArgv = (argv: ToolArgv): Partial<ToolOpts> => {
    const opts: Partial<ToolOpts> = {
        path: path.resolve(argv["$0"], argv["_"][0]),
        noQuestions: argv.default,
    };
    return opts;
};
