import { HERMIONE_GLOBAL_HOOK } from "../constants/plugins";
import type { HermioneConfig } from "../types/hermioneConfig";

export default {
    name: HERMIONE_GLOBAL_HOOK,
    fn: (config: HermioneConfig): void => {
        config.plugins![HERMIONE_GLOBAL_HOOK] = {
            __comment: "https://github.com/gemini-testing/hermione-global-hook",
            enabled: true,
            __comment1: 'Add "beforeEach" function, it will be run before each test',
            __comment2: 'Add "afterEach" function, it will be run after each test',
        };
    },
};
