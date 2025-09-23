import { loadEsm } from "load-esm";
import type inquirer from "@inquirer/prompts";
import type { Context } from "@inquirer/type";

export type InquirerPromptType =
    | "checkbox"
    | "confirm"
    | "input"
    | "number"
    | "expand"
    | "rawlist"
    | "password"
    | "search"
    | "select";

export type InquirerPrompts = { [K in InquirerPromptType]: Parameters<typeof inquirer[K]>[0] & { type: K } };

export type InquirerPrompt = InquirerPrompts[InquirerPromptType];

export const inquirerPrompt = async <R = unknown>(prompt: InquirerPrompt, context?: Context): Promise<R> => {
    const inquirer = await loadEsm<typeof import("@inquirer/prompts")>("@inquirer/prompts");
    const inquirerModule = inquirer[prompt.type] as (prompt: InquirerPrompt, context?: Context) => Promise<R>;

    return inquirerModule(prompt, context);
};
