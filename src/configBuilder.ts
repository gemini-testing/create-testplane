import _ from "lodash";
import inquirer from "inquirer";
import { writeHermioneConfig } from "./fsUtils";
import defaultPluginsConfig from "./pluginsConfig";
import defaultToolOpts from "./constants/defaultToolOpts";
import defaultHermioneConfig from "./constants/defaultHermioneConfig";
import type { HermioneConfig, Language } from "./types/hermioneConfig";
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

    private _config: HermioneConfig;

    constructor(
        createBaseConfig?: CreateBaseConfigCallback,
        opts: { language: Language } = { language: defaultToolOpts.language },
    ) {
        this._config = createBaseConfig ? createBaseConfig(defaultHermioneConfig, opts) : defaultHermioneConfig;

        this._config.__template = getTemplate(opts.language);
    }

    async handleGeneralQuestions(
        promts: GeneralPrompt[],
        handlers: HandleGeneralPromptsCallback[],
        { path, noQuestions }: { path: string; noQuestions: boolean },
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

        const promptsToAsk = noQuestions ? promts.filter(prompt => _.isUndefined(prompt.default)) : promts;
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
        return writeHermioneConfig(dirPath, this._config);
    }
}
