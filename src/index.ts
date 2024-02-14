import defaultToolOpts from "./constants/defaultToolOpts";
import { initApp, installPackages } from "./package";
import {
    askQuestion,
    baseGeneralPromptsHandler,
    extendWithTypescript,
    printSuccessMessage,
    writeTestExample,
} from "./utils";
import { ConfigNote, getPluginNames } from "./plugins";
import baseGeneralPrompts from "./constants/baseGeneralPrompts";
import { ConfigBuilder } from "./configBuilder";
import type { DefaultOpts, GeneralPrompt, HandleGeneralPromptsCallback, ToolOpts } from "./types/toolOpts";
import type { HermioneConfig, Language } from "./types/hermioneConfig";
import type { PluginsConfig } from "./types/pluginsConfig";

export type CreateBaseConfigOpts = { language: Language };

export type CreateOptsCallback = (defaultOpts: DefaultOpts) => ToolOpts;
export type CreateBaseConfigCallback = (
    defaultHermioneConfig: HermioneConfig,
    opts: CreateBaseConfigOpts,
) => HermioneConfig;
export type CreatePluginsConfigCallback = (pluginsConfig: PluginsConfig) => PluginsConfig;
export type GetExtraPackagesToInstallCallback = () => { names: string[]; notes: ConfigNote[] };

export interface CreateHermioneAppOpts {
    createBaseConfig?: CreateBaseConfigCallback;
    createOpts: CreateOptsCallback;
    generalPrompts?: GeneralPrompt[];
    generalPromptsHandler?: HandleGeneralPromptsCallback;
    createPluginsConfig?: CreatePluginsConfigCallback;
    getExtraPackagesToInstall?: GetExtraPackagesToInstallCallback;
    registry?: string;
}

process.on("uncaughtException", err => {
    console.error(err.stack);
    process.exit(1);
});

process.on("unhandledRejection", (reason, p) => {
    console.error("Unhandled Rejection:\n  Promise: ", p, "\n  Reason: ", reason);
});

export { askQuestion, defineVariable, addModule, asExpression } from "./utils";
export { baseGeneralPrompts };
export { defaultHermioneTestsDir } from "./constants/defaultHermioneConfig";

export const run = async ({
    createBaseConfig,
    createOpts,
    generalPrompts = baseGeneralPrompts,
    generalPromptsHandler,
    createPluginsConfig,
    getExtraPackagesToInstall,
    registry = "https://registry.npmjs.org",
}: CreateHermioneAppOpts): Promise<void> => {
    const opts = createOpts(defaultToolOpts);
    const configBuilder = ConfigBuilder.create(createBaseConfig, { language: opts.language });

    const packageManager = await initApp(opts.path, opts.noQuestions);

    const generalPromptsHandlers = generalPromptsHandler
        ? [baseGeneralPromptsHandler, generalPromptsHandler]
        : [baseGeneralPromptsHandler];

    const generalAnswers = await configBuilder.handleGeneralQuestions(generalPrompts, generalPromptsHandlers, opts);

    const { pluginNames, configNotes } = await getPluginNames(opts);

    await configBuilder.configurePlugins({ pluginNames, createPluginsConfig, generalAnswers });

    const extraPackages = getExtraPackagesToInstall ? getExtraPackagesToInstall() : { names: [], notes: [] };
    const packageNamesToInstall = pluginNames.concat(extraPackages.names);

    if (opts.language === "ts") {
        extendWithTypescript(packageNamesToInstall, opts.path);
    }

    await Promise.all([
        installPackages(opts.path, packageManager, packageNamesToInstall, registry),
        configBuilder.write(opts.path),
        writeTestExample(opts.path, opts.language),
    ]);

    printSuccessMessage(configNotes.concat(extraPackages.notes));
};

export default { run, askQuestion, baseGeneralPrompts };
export * from "./types";
