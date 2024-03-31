import type { TestplaneConfig, Language } from "./testplaneConfig";

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

export interface Answers extends Record<string, unknown> {
    _path: string;
    _language: Language;
}

export type HandleGeneralPromptsCallback = (
    testplaneConfig: TestplaneConfig,
    answers: Answers,
) => Promise<TestplaneConfig> | TestplaneConfig;

export interface ArgvOpts {
    path: string;
    language: Language;
    noQuestions: boolean;
}

export interface DefaultOpts {
    language: Language;
    pluginGroups: PluginGroup[];
}

export type ToolOpts = ArgvOpts & DefaultOpts;
