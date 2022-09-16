export interface PluginPrompt {
    plugin: string;
    description: string;
    default: boolean;
    configNote?: string;
}

export interface PluginGroup {
    description: string;
    plugins: PluginPrompt[];
}

export interface GeneralPrompt {
    type: "input" | "number" | "confirm" | "list" | "rawlist" | "expand" | "checkbox" | "password" | "editor";
    name: string;
    message: string;
    default?: any | any[];
    choices?: any[];
}

export interface ToolOpts {
    path: string;
    noQuestions: boolean;
    pluginGroups: PluginGroup[];
    generalPromts: GeneralPrompt[];
}
