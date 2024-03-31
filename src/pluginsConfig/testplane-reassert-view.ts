import { TESTPLANE_REASSERT_VIEW } from "../constants/plugins";
import type { TestplaneConfig } from "../types/testplaneConfig";

export default {
    name: TESTPLANE_REASSERT_VIEW,
    fn: (config: TestplaneConfig): void => {
        config.plugins![TESTPLANE_REASSERT_VIEW] = {
            __comment: "https://github.com/gemini-testing/testplane-reassert-view",
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
