import inquirer from "inquirer";
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

const getDefaultPluginNames = (opts: ToolOpts): string[] => {
    return opts.pluginGroups.reduce((pluginNames: string[], currentGroup) => {
        const groupDefaultPlugins = currentGroup.plugins.filter(prompt => prompt.default);
        const groupPluginNames = groupDefaultPlugins.map(prompt => prompt.plugin);
        return pluginNames.concat(groupPluginNames);
    }, []);
};

const askPluginNames = async (opts: ToolOpts): Promise<string[]> => {
    let pluginNames: string[] = [];
    const pluginGroupsKey = 'plugin-groups';
    const pluginKey = 'plugin';

    const getDefaultFeatures = (opts: ToolOpts) => {
        const inds: number[] = [];
        opts.pluginGroups.forEach(({plugins}, ind) => {
            if (plugins.some(plugin => plugin.default)) {
                inds.push(ind);
            }
        });
        return inds;
    };

    const wantedFeatures = await inquirer.prompt({
        name: pluginGroupsKey,
        type: 'checkbox',
        message: 'Which features do you need?',
        choices: opts.pluginGroups.map((group, ind) => ({name: group.description, value: ind})),
        default: getDefaultFeatures(opts)
    });

    for (const ind of wantedFeatures[pluginGroupsKey]) {
        const {description, plugins} = opts.pluginGroups[ind];
        const curGroupPlugins = await inquirer.prompt({
            name: pluginKey,
            type: 'checkbox',
            message: `Plugins: ${description}`,
            choices: plugins.map(
                ({plugin, description}) => ({name: `${plugin}\t--\t${description}`, value: plugin})
            ),
            default: plugins.filter(plugin => plugin.default).map(({plugin}) => plugin)
        });
        pluginNames = pluginNames.concat(curGroupPlugins[pluginKey]);
    }

    return pluginNames;
};

export const getPluginNames = async (opts: ToolOpts): Promise<string[]> => {
    return opts.noQuestions
        ? getDefaultPluginNames(opts)
        : await askPluginNames(opts);
}
