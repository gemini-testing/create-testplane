import { HERMIONE_TABS_CLOSER } from "../constants/plugins";
import type { HermioneConfig } from "../types/hermioneConfig";

export default {
    name: HERMIONE_TABS_CLOSER,
    fn: (config: HermioneConfig): void => {
        config.plugins![HERMIONE_TABS_CLOSER] = {
            __comment: "https://github.com/gemini-testing/hermione-tabs-closer",
            enabled: true,
            __comment1: 'Add property "browsers" with regexp value like "browsers": /chrome/',
        };
    },
};
