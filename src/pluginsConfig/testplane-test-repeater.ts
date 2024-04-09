import { TESTPLANE_TEST_REPEATER } from "../constants/plugins";
import type { TestplaneConfig } from "../types/testplaneConfig";

export default {
    name: TESTPLANE_TEST_REPEATER,
    fn: (config: TestplaneConfig): void => {
        config.plugins![TESTPLANE_TEST_REPEATER] = {
            __comment: "https://github.com/gemini-testing/testplane-test-repeater",
            enabled: false,
            repeat: 5,
            minRepeat: 0,
            maxRepeat: 100,
            uniqSession: true,
        };
    },
};
