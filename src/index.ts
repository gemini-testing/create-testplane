import defaultToolOpts from "./constants/defaultToolOpts";
import { initApp, installPackages } from "./package";
import { askQuestion, baseGeneralPromptsHandler, printSuccessMessage, writeTestExample } from "./utils";
import { ConfigNote, getPluginNames } from "./plugins";
import baseGeneralPrompts from "./constants/baseGeneralPrompts";
import { ConfigBuilder } from "./configBuilder";
import type { DefaultOpts, GeneralPrompt, HandleGeneralPromptsCallback, ToolOpts } from "./types/toolOpts";
import type { HermioneConfig } from "./types/hermioneConfig";
import type { PluginsConfig } from "./types/pluginsConfig";

export type CreateOptsCallback = (defaultOpts: DefaultOpts) => ToolOpts;
export type CreateBaseConfigCallback = (defaultHermioneConfig: HermioneConfig) => HermioneConfig;
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

export const run = async ({
    createBaseConfig,
    createOpts,
    generalPrompts = baseGeneralPrompts,
    generalPromptsHandler,
    createPluginsConfig,
    getExtraPackagesToInstall,
    registry = "https://registry.npmjs.org",
}: CreateHermioneAppOpts): Promise<void> => {
    const configBuilder = ConfigBuilder.create(createBaseConfig);
    const opts = createOpts(defaultToolOpts);

    const packageManager = await initApp(opts.path, opts.noQuestions);

    const generalPromptsHandlers = generalPromptsHandler
        ? [baseGeneralPromptsHandler, generalPromptsHandler]
        : [baseGeneralPromptsHandler];

    await configBuilder.handleGeneralQuestions(generalPrompts, generalPromptsHandlers, opts);

    const { pluginNames, configNotes } = await getPluginNames(opts);
    const extraPackages = getExtraPackagesToInstall ? getExtraPackagesToInstall() : { names: [], notes: [] };

    await configBuilder.configurePlugins(pluginNames, createPluginsConfig);

    await Promise.all([
        installPackages(opts.path, packageManager, pluginNames.concat(extraPackages.names), registry),
        configBuilder.write(opts.path),
        writeTestExample(opts.path),
    ]);

    printSuccessMessage(configNotes.concat(extraPackages.notes));
};

export default { run, askQuestion, baseGeneralPrompts };
export * from "./types";
