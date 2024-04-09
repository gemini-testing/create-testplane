import { TESTPLANE_STORYBOOK } from "../constants/plugins";
import type { TestplaneConfig } from "../types/testplaneConfig";

export default {
    name: TESTPLANE_STORYBOOK,
    fn: (config: TestplaneConfig): void => {
        config.plugins![TESTPLANE_STORYBOOK] = {
            __comment1: "https://github.com/gemini-testing/hermione-storybook",
            __comment2: "To run hermione storybook tests, use --storybook flag when launching hermione",
            __comment3: "And dont forget to set 'buildStoriesJson: true' in storybook config if you use storybook@6",
            enabled: true,
            autoScreenshots: true,
            storybookConfigDir: ".storybook",
            localport: 6006,
        };
    },
};
