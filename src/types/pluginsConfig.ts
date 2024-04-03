import type { TestplaneConfig } from "./testplaneConfig";
import type { Answers } from "./toolOpts";

export interface PluginsConfig {
    [plugin: string]: (config: TestplaneConfig, generalAnswers?: Answers) => void | Promise<void>;
}
