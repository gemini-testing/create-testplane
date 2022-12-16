import type { HermioneConfig } from "./hermioneConfig";

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

export type HandleGeneralPromptsCallback = (
    hermioneConfig: HermioneConfig,
    answers: Record<string, any>,
) => Promise<HermioneConfig> | HermioneConfig;

export interface ArgvOpts {
    path: string;
    noQuestions: boolean;
}

export interface DefaultOpts {
    pluginGroups: PluginGroup[];
}

export type ToolOpts = ArgvOpts & DefaultOpts;
