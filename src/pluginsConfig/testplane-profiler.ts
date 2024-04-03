import { TESTPLANE_PROFILER } from "../constants/plugins";
import type { TestplaneConfig } from "../types/testplaneConfig";

export default {
    name: TESTPLANE_PROFILER,
    fn: (config: TestplaneConfig): void => {
        config.plugins![TESTPLANE_PROFILER] = {
            __comment: "https://github.com/gemini-testing/testplane-profiler",
            enabled: true,
            path: "testplane-profiler",
        };
    },
};
