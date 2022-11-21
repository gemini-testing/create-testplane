import { HERMIONE_RETRY_PROGRESSIVE } from "../constants/plugins";
import type { HermioneConfig } from "../types/hermioneConfig";

export default {
    name: HERMIONE_RETRY_PROGRESSIVE,
    fn: (config: HermioneConfig): void => {
        config.plugins![HERMIONE_RETRY_PROGRESSIVE] = {
            __comment: "https://github.com/gemini-testing/hermione-retry-progressive",
            enabled: true,
            extraRetry: 5,
            errorPatterns: ["__comment: Write here error patterns (supports regex)"],
        };
    },
};
