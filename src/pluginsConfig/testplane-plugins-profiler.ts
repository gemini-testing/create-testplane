import { TESTPLANE_PLUGINS_PROFILER } from "../constants/plugins";
import type { TestplaneConfig } from "../types/testplaneConfig";

export default {
    name: TESTPLANE_PLUGINS_PROFILER,
    fn: (config: TestplaneConfig): void => {
        config.plugins![TESTPLANE_PLUGINS_PROFILER] = {
            __comment: "https://github.com/gemini-testing/testplane-plugins-profiler",
            enabled: true,
            reportPath: "./plugins-profiler",
        };
    },
};
