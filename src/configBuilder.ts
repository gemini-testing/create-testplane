import _ from "lodash";
import inquirer from "inquirer";
import { writeTestplaneConfig } from "./fsUtils";
import defaultPluginsConfig from "./pluginsConfig";
import defaultToolOpts from "./constants/defaultToolOpts";
import defaultTestplaneConfig from "./constants/defaultTestplaneConfig";
import type { TestplaneConfig, Language } from "./types/testplaneConfig";
import type { Answers, HandleGeneralPromptsCallback } from "./types/toolOpts";
import type { CreateBaseConfigCallback, CreatePluginsConfigCallback } from ".";
import type { GeneralPrompt } from "./types/toolOpts";
import { getTemplate } from "./utils/configTemplates";

type ConfigurePluginsOpts = {
    pluginNames: string[];
    createPluginsConfig?: CreatePluginsConfigCallback;
    generalAnswers: Answers;
};

export class ConfigBuilder {
    static create(createBaseConfig?: CreateBaseConfigCallback, opts?: { language: Language }): ConfigBuilder {
        return new this(createBaseConfig, opts);
    }

    private _config: TestplaneConfig;

    constructor(
        createBaseConfig?: CreateBaseConfigCallback,
        opts: { language: Language } = { language: defaultToolOpts.language },
    ) {
        this._config = createBaseConfig ? createBaseConfig(defaultTestplaneConfig, opts) : defaultTestplaneConfig;

        this._config.__template = getTemplate(opts.language);
    }

    async handleGeneralQuestions(
        promts: GeneralPrompt[],
        handlers: HandleGeneralPromptsCallback[],
        { path, extraQuestions }: { path: string; extraQuestions: boolean },
    ): Promise<Answers> {
        const answers: Answers = {
            _path: path,
            _language: this._config.__template!.language,
        };

        if (_.isEmpty(promts) || _.isEmpty(handlers)) {
            return answers;
        }

        const defaults = promts.reduce((acc, prompt) => {
            if (!_.isUndefined(prompt.default)) {
                _.set(acc, [prompt.name], prompt.default);
            }

            return acc;
        }, {});

        const promptsToAsk = extraQuestions ? promts : promts.filter(prompt => _.isUndefined(prompt.default));
        const inquirerAnswers = await inquirer.prompt(promptsToAsk);

        Object.assign(answers, defaults, inquirerAnswers, answers);

        for (const handler of handlers) {
            this._config = await handler(this._config, answers);
        }

        return answers;
    }

    async configurePlugins({ pluginNames, createPluginsConfig, generalAnswers }: ConfigurePluginsOpts): Promise<void> {
        const pluginsConfig = createPluginsConfig ? createPluginsConfig(defaultPluginsConfig) : defaultPluginsConfig;

        this._config.plugins ||= {};

        for (const plugin of pluginNames) {
            await pluginsConfig[plugin](this._config, generalAnswers);
        }
    }

    async write(dirPath: string): Promise<void> {
        return writeTestplaneConfig(dirPath, this._config);
    }
}
