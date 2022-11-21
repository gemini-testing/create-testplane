import type { HermioneConfig } from "./hermioneConfig";

export interface PluginsConfig {
    [plugin: string]: (config: HermioneConfig) => void | Promise<void>;
}
