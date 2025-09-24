import type { InquirerPrompt } from "../utils/inquirer";
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

export type GeneralPrompt = InquirerPrompt & { name: string; default?: unknown | unknown[] };

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
    extraQuestions: boolean;
}

export interface DefaultOpts {
    language: Language;
    pluginGroups: PluginGroup[];
}

export type ToolOpts = ArgvOpts & DefaultOpts;
