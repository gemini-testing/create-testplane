import { HERMIONE_PROFILER } from "../constants/plugins";
import type { HermioneConfig } from "../types/hermioneConfig";

export default {
    name: HERMIONE_PROFILER,
    fn: (config: HermioneConfig): void => {
        config.plugins![HERMIONE_PROFILER] = {
            __comment: "https://github.com/gemini-testing/hermione-profiler",
            enabled: true,
            path: "hermione-profiler",
        };
    },
};
