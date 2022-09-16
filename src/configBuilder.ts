import { configurePlugins } from "./plugins";
import { writeHermioneConfig } from "./fsUtils";
import defaultPluginsConfig from "./pluginsConfig";
import defaultHermioneConfig from "./constants/defaultHermioneConfig";
import { handleGeneralQuestions } from "./utils";
import type { HermioneConfig } from "./types/hermioneConfig";
import type { HandleGeneralPromptsCallback } from "./utils";
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
        promts: (GeneralPrompt[] | undefined)[],
        handler: (HandleGeneralPromptsCallback | undefined)[],
        noQuestions: boolean,
    ): Promise<void> {
        for (let i = 0; i < handler.length; i++) {
            if (!promts[i] || !handler[i]) {
                continue;
            }
            this._config = await handleGeneralQuestions(promts[i]!, this._config, handler[i]!, noQuestions);
        }
    }

    async configurePlugins(
        pluginNames: string[],
        createPluginsConfig: CreatePluginsConfigCallback | undefined,
    ): Promise<void> {
        const pluginsConfig = createPluginsConfig ? createPluginsConfig(defaultPluginsConfig) : defaultPluginsConfig;
        await configurePlugins(this._config, pluginNames, pluginsConfig);
    }

    async write(dirPath: string): Promise<void> {
        return writeHermioneConfig(dirPath, this._config);
    }
}
