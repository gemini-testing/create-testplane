import { HERMIONE_TEST_REPEATER } from "../constants/plugins";
import type { HermioneConfig } from "../types/hermioneConfig";

export default {
    name: HERMIONE_TEST_REPEATER,
    fn: (config: HermioneConfig): void => {
        config.plugins![HERMIONE_TEST_REPEATER] = {
            __comment: "https://github.com/gemini-testing/hermione-test-repeater",
            enabled: false,
            repeat: 5,
            minRepeat: 0,
            maxRepeat: 100,
            uniqSession: true,
        };
    },
};
