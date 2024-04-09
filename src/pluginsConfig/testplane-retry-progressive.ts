import { TESTPLANE_RETRY_PROGRESSIVE } from "../constants/plugins";
import type { TestplaneConfig } from "../types/testplaneConfig";

export default {
    name: TESTPLANE_RETRY_PROGRESSIVE,
    fn: (config: TestplaneConfig): void => {
        config.plugins![TESTPLANE_RETRY_PROGRESSIVE] = {
            __comment: "https://github.com/gemini-testing/testplane-retry-progressive",
            enabled: true,
            extraRetry: 5,
            errorPatterns: ["__comment: Write here error patterns (supports regex)"],
        };
    },
};
