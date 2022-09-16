import { HERMIONE_PLUGINS_PROFILER } from "../constants/plugins";
import type { HermioneConfig } from "../types/hermioneConfig";

export default {
    name: HERMIONE_PLUGINS_PROFILER,
    fn: (config: HermioneConfig): void => {
        config.plugins![HERMIONE_PLUGINS_PROFILER] = {
            __comment: "https://github.com/gemini-testing/hermione-plugins-profiler",
            enabled: true,
            reportPath: "./plugins-profiler",
        };
    },
};
