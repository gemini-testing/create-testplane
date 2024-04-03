import { TESTPLANE_STORYBOOK } from "../constants/plugins";
import type { TestplaneConfig } from "../types/testplaneConfig";

export default {
    name: TESTPLANE_STORYBOOK,
    fn: (config: TestplaneConfig): void => {
        config.plugins![TESTPLANE_STORYBOOK] = {
            __comment: "https://github.com/gemini-testing/testplane-storybook",
            enabled: true,
            storybookUrl: "http://localhost:6006",
        };
    },
};
