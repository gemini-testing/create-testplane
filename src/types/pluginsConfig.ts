import type { HermioneConfig } from "./hermioneConfig";
import type { Answers } from "./toolOpts";

export interface PluginsConfig {
    [plugin: string]: (config: HermioneConfig, generalAnswers?: Answers) => void | Promise<void>;
}
