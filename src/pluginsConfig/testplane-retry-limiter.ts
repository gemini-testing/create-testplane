import { TESTPLANE_RETRY_LIMITER } from "../constants/plugins";
import type { TestplaneConfig } from "../types/testplaneConfig";

export default {
    name: TESTPLANE_RETRY_LIMITER,
    fn: (config: TestplaneConfig): void => {
        config.plugins![TESTPLANE_RETRY_LIMITER] = {
            __comment: "https://github.com/gemini-testing/testplane-retry-limiter",
            enabled: true,
            limit: 0.3,
            setRetriesOnTestFail: 1,
            timeLimit: 1200,
        };
    },
};
