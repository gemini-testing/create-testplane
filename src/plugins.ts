import type { ToolOpts } from "./types/toolOpts";
import { inquirerPrompt, packageNameFromPlugin } from "./utils";

export type ConfigNote = { plugin: string; configNote: string };

const getDefaultPluginNames = (opts: ToolOpts): { pluginNames: string[]; configNotes: ConfigNote[] } => {
    const pluginNames = opts.pluginGroups.reduce((pluginNames: string[], currentGroup) => {
        const groupDefaultPlugins = currentGroup.plugins.filter(prompt => prompt.default);
        const groupPluginNames = groupDefaultPlugins.map(prompt => prompt.plugin);
        return pluginNames.concat(groupPluginNames);
    }, []);

    return { pluginNames, configNotes: [] };
};

const askPluginNames = async (opts: ToolOpts): Promise<{ pluginNames: string[]; configNotes: ConfigNote[] }> => {
    let pluginNames: string[] = [];
    let configNotes: ConfigNote[] = [];

    const wantedFeatures = await inquirerPrompt<number[]>({
        type: "checkbox",
        message: "Which features do you need?",
        choices: opts.pluginGroups.map((group, ind) => ({
            name: group.description,
            value: ind,
            checked: group.plugins.some(plugin => plugin.default),
        })),
    });

    for (const ind of wantedFeatures) {
        const { description, plugins } = opts.pluginGroups[ind];
        const curGroupPlugins = await inquirerPrompt<number[]>({
            type: "checkbox",
            message: `Plugins: ${description}`,
            choices: plugins.map(({ plugin, description, default: checked }, index) => ({
                name: `${description} (${packageNameFromPlugin(plugin)})`,
                value: index,
                checked,
            })),
        });

        const notesIndToAdd = curGroupPlugins.filter(ind => plugins[ind].configNote);
        const pluginNamesToAdd = curGroupPlugins.map(ind => plugins[ind].plugin);
        const notesToAdd: ConfigNote[] = notesIndToAdd.map(ind => ({
            plugin: plugins[ind].plugin,
            configNote: plugins[ind].configNote as string,
        }));

        pluginNames = pluginNames.concat(pluginNamesToAdd);
        configNotes = configNotes.concat(notesToAdd);
    }

    return { pluginNames, configNotes };
};

export const getPluginNames = async (opts: ToolOpts): Promise<{ pluginNames: string[]; configNotes: ConfigNote[] }> => {
    return opts.extraQuestions ? await askPluginNames(opts) : getDefaultPluginNames(opts);
};
