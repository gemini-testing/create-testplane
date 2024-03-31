import _ from "lodash";
import { TESTPLANE_HEADLESS_CHROME } from "../constants/plugins";
import { defaultTestplaneTestsDir } from "../constants/defaultTestplaneConfig";
import type { TestplaneConfig } from "../types/testplaneConfig";

export default {
    name: TESTPLANE_HEADLESS_CHROME,
    fn: (config: TestplaneConfig): void => {
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
                        files: [`${defaultTestplaneTestsDir}/**/*.testplane.js`],
                    },
                },
            },
            (objValue, srcValue) => (_.isArray(objValue) ? _.uniq(objValue.concat(srcValue)) : undefined),
        );

        config.plugins![TESTPLANE_HEADLESS_CHROME] = {
            __comment: "https://github.com/gemini-testing/testplane-headless-chrome",
            enabled: true,
            browserId,
            version: "98",
            downloadAttempts: 30,
        };
    },
};
