import { HTML_REPORTER } from "../constants/plugins";
import type { HermioneConfig } from "../types/hermioneConfig";

export default {
    name: HTML_REPORTER,
    fn: (config: HermioneConfig): void => {
        config.plugins![HTML_REPORTER] = {
            __comment: "https://github.com/gemini-testing/html-reporter",
            enabled: true,
            path: "hermione-report",
            defaultView: "all",
            diffMode: "3-up-scaled",
        };
    },
};
