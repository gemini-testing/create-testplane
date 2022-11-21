import _ from "lodash";
import { HERMIONE_HEADLESS_CHROME } from "../constants/plugins";
import type { HermioneConfig } from "../types/hermioneConfig";

export default {
    name: HERMIONE_HEADLESS_CHROME,
    fn: (config: HermioneConfig): void => {
        const browserId = "chrome-headless";

        _.mergeWith(
            config,
            {
                browsers: {
                    "chrome-headless": {
                        automationProtocol: "devtools",
                        desiredCapabilities: {
                            browserName: "chrome",
                        },
                    },
                },
                sets: {
                    desktop: {
                        browsers: [browserId],
                        files: ["tests/**/*.hermione.js"],
                    },
                },
            },
            (objValue, srcValue) => (_.isArray(objValue) ? _.uniq(objValue.concat(srcValue)) : undefined),
        );

        config.plugins![HERMIONE_HEADLESS_CHROME] = {
            __comment: "https://github.com/gemini-testing/hermione-headless-chrome",
            enabled: true,
            browserId,
            version: "98",
            downloadAttempts: 30,
        };
    },
};
