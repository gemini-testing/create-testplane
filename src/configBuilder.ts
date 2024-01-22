import _ from "lodash";
import inquirer from "inquirer";
import { writeHermioneConfig } from "./fsUtils";
import defaultPluginsConfig from "./pluginsConfig";
import defaultHermioneConfig from "./constants/defaultHermioneConfig";
import type { HermioneConfig } from "./types/hermioneConfig";
import type { HandleGeneralPromptsCallback } from "./types/toolOpts";
import type { CreateBaseConfigCallback, CreatePluginsConfigCallback } from ".";
import type { GeneralPrompt } from "./types/toolOpts";

export class ConfigBuilder {
    static create(createBaseConfig?: CreateBaseConfigCallback): ConfigBuilder {
        return new this(createBaseConfig);
    }

    private _config: HermioneConfig;

    constructor(createBaseConfig?: CreateBaseConfigCallback) {
        this._config = createBaseConfig ? createBaseConfig(defaultHermioneConfig) : defaultHermioneConfig;
    }

    async handleGeneralQuestions(
        promts: GeneralPrompt[],
        handlers: HandleGeneralPromptsCallback[],
        { path, noQuestions }: { path: string; noQuestions: boolean },
    ): Promise<void> {
        if (_.isEmpty(promts) || _.isEmpty(handlers)) {
            return;
        }

        const defaults = promts.reduce((acc, prompt) => {
            if (!_.isUndefined(prompt.default)) {
                _.set(acc, [prompt.name], prompt.default);
            }

            return acc;
        }, {});

        const promptsToAsk = noQuestions ? promts.filter(prompt => _.isUndefined(prompt.default)) : promts;
        const inquirerAnswers = await inquirer.prompt(promptsToAsk);
        const answers = noQuestions ? { ...defaults, ...inquirerAnswers } : inquirerAnswers;

        answers._path = path;

        for (const handler of handlers) {
            this._config = await handler(this._config, answers);
        }
    }

    async configurePlugins(pluginNames: string[], createPluginsConfig?: CreatePluginsConfigCallback): Promise<void> {
        const pluginsConfig = createPluginsConfig ? createPluginsConfig(defaultPluginsConfig) : defaultPluginsConfig;

        this._config.plugins ||= {};

        for (const plugin of pluginNames) {
            await pluginsConfig[plugin](this._config);
        }
    }

    async write(dirPath: string): Promise<void> {
        return writeHermioneConfig(dirPath, this._config);
    }
}
