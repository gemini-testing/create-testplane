import { HERMIONE_STORYBOOK } from "../constants/plugins";
import type { HermioneConfig } from "../types/hermioneConfig";

export default {
    name: HERMIONE_STORYBOOK,
    fn: (config: HermioneConfig): void => {
        config.plugins![HERMIONE_STORYBOOK] = {
            __comment: "https://github.com/gemini-testing/hermione-storybook",
            enabled: true,
            storybookUrl: "http://localhost:6006",
        };
    },
};
