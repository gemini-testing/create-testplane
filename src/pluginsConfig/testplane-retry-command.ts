import { TESTPLANE_RETRY_COMMAND } from "../constants/plugins";
import type { TestplaneConfig } from "../types/testplaneConfig";

export default {
    name: TESTPLANE_RETRY_COMMAND,
    fn: (config: TestplaneConfig): void => {
        const defaultRule = {
            browsers: Object.keys(config.browsers),
            retryCount: 2,
            retryInterval: 100,
        };

        config.plugins![TESTPLANE_RETRY_COMMAND] = {
            __comment: "https://github.com/gemini-testing/testplane-retry-command",
            enabled: true,
            rules: [
                {
                    ...defaultRule,
                    condition: "blank-screenshot",
                },
                {
                    ...defaultRule,
                    condition: "assert-view-failed",
                    retryOnlyFirst: false,
                },
            ],
        };
    },
};
