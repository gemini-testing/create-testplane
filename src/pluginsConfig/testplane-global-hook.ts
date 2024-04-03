import { TESTPLANE_GLOBAL_HOOK } from "../constants/plugins";
import type { TestplaneConfig } from "../types/testplaneConfig";

export default {
    name: TESTPLANE_GLOBAL_HOOK,
    fn: (config: TestplaneConfig): void => {
        config.plugins![TESTPLANE_GLOBAL_HOOK] = {
            __comment: "https://github.com/gemini-testing/testplane-global-hook",
            enabled: true,
            __comment1: 'Add "beforeEach" function, it will be run before each test',
            __comment2: 'Add "afterEach" function, it will be run after each test',
        };
    },
};
