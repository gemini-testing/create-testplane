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
    generalPrompts?: {
        prompts: GeneralPrompt[];
        handler: HandleGeneralPromptsCallback;
    };
    createPluginsConfig?: CreatePluginsConfigCallback;
    getExtaPackagesToInstall?: GetExtraPackagesToInstallCallback;
    registry?: string;
}

process.on("uncaughtException", err => {
    console.error(err.stack);
    process.exit(1);
});

process.on("unhandledRejection", (reason, p) => {
    console.error("Unhandled Rejection:\n  Promise: ", p, "\n  Reason: ", reason);
});

export { askQuestion } from "./utils";

export const run = async ({
    createBaseConfig,
    createOpts,
    generalPrompts,
    createPluginsConfig,
    getExtaPackagesToInstall,
    registry = "https://registry.npmjs.org",
}: CreateHermioneAppOpts): Promise<void> => {
    const configBuilder = ConfigBuilder.create(createBaseConfig);
    const opts = createOpts(defaultToolOpts);

    const packageManager = await initApp(opts.path, opts.noQuestions);

    await configBuilder.handleGeneralQuestions(
        [baseGeneralPrompts, generalPrompts?.prompts],
        [baseGeneralPromptsHandler, generalPrompts?.handler],
        opts.noQuestions,
    );

    const { pluginNames, configNotes } = await getPluginNames(opts);
    const extraPackages = getExtaPackagesToInstall ? getExtaPackagesToInstall() : { names: [], notes: [] };

    await configBuilder.configurePlugins(pluginNames, createPluginsConfig);

    await Promise.all([
        installPackages(opts.path, packageManager, pluginNames.concat(extraPackages.names), registry),
        configBuilder.write(opts.path),
        writeTestExample(opts.path),
    ]);

    printSuccessMessage(configNotes.concat(extraPackages.notes));
};

export default { run, askQuestion };
export * from "./types";
