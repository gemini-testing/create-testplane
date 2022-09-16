import { RETRY_LIMITER } from "../constants/plugins";
import type { HermioneConfig } from "../types/hermioneConfig";

export default {
    name: RETRY_LIMITER,
    fn: (config: HermioneConfig): void => {
        config.plugins![RETRY_LIMITER] = {
            __comment: "https://github.com/gemini-testing/retry-limiter",
            enabled: true,
            limit: 0.3,
            setRetriesOnTestFail: 1,
            timeLimit: 1200,
        };
    },
};
