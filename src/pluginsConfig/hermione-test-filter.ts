import { HERMIONE_TEST_FILTER } from "../constants/plugins";
import type { HermioneConfig } from "../types/hermioneConfig";

export default {
    name: HERMIONE_TEST_FILTER,
    fn: (config: HermioneConfig): void => {
        config.plugins![HERMIONE_TEST_FILTER] = {
            __comment: "https://github.com/gemini-testing/hermione-test-filter",
            enabled: true,
            inputFile: "hermione-filter.json",
            __comment1: "Create a file hermione-filter.json",
            __comment2: "With the following structure:",
            __comment3: "[",
            __comment4: "    {",
            __comment5: '        "fullTitle": "some-title",',
            __comment6: '        "browserId": "some-browser"',
            __comment7: "    }",
            __comment8: "]",
        };
    },
};
