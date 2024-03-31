import { HTML_REPORTER } from "../constants/plugins";
import type { TestplaneConfig } from "../types/testplaneConfig";

export default {
    name: HTML_REPORTER,
    fn: (config: TestplaneConfig): void => {
        config.plugins![HTML_REPORTER] = {
            __comment: "https://github.com/gemini-testing/html-reporter",
            enabled: true,
            path: "testplane-report",
            defaultView: "all",
            diffMode: "3-up-scaled",
        };
    },
};
