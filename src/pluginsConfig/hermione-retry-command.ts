import { HERMIONE_RETRY_COMMAND } from "../constants/plugins";
import type { HermioneConfig } from "../types/hermioneConfig";

export default {
    name: HERMIONE_RETRY_COMMAND,
    fn: (config: HermioneConfig): void => {
        const defaultRule = {
            browsers: Object.keys(config.browsers),
            retryCount: 2,
            retryInterval: 100,
        };

        config.plugins![HERMIONE_RETRY_COMMAND] = {
            __comment: "https://github.com/gemini-testing/hermione-retry-command",
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
