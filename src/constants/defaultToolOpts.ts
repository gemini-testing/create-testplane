import { PluginGroup, ToolOpts } from "../types/toolOpts";

const firstGroup: PluginGroup = {
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
};

const secondGroup: PluginGroup = {
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
};

const defaultToolOpts: Partial<ToolOpts> = {
    pluginGroups: [firstGroup, secondGroup],
};

export default defaultToolOpts;
