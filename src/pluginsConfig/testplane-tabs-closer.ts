import { TESTPLANE_TABS_CLOSER } from "../constants/plugins";
import type { TestplaneConfig } from "../types/testplaneConfig";

export default {
    name: TESTPLANE_TABS_CLOSER,
    fn: (config: TestplaneConfig): void => {
        config.plugins![TESTPLANE_TABS_CLOSER] = {
            __comment: "https://github.com/gemini-testing/testplane-tabs-closer",
            enabled: true,
            __comment1: 'Add property "browsers" with regexp value like "browsers": /chrome/',
        };
    },
};
