import { HERMIONE_REASSERT_VIEW } from "../constants/plugins";
import type { HermioneConfig } from "../types/hermioneConfig";

export default {
    name: HERMIONE_REASSERT_VIEW,
    fn: (config: HermioneConfig): void => {
        config.plugins![HERMIONE_REASSERT_VIEW] = {
            __comment: "https://github.com/gemini-testing/hermione-reassert-view",
            enabled: true,
            browsers: Object.keys(config.browsers),
            maxDiffSize: {
                width: 15,
                height: 15,
            },
            dry: false,
        };
    },
};
