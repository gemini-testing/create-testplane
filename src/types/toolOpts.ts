export interface PluginPrompt {
    plugin: string;
    description: string;
    default: boolean;
}

export interface PluginGroup {
    description: string;
    plugins: PluginPrompt[];
}

export interface ToolOpts {
    path: string;
    noQuestions: boolean;
    pluginGroups: PluginGroup[];
}
