import { TESTPLANE_TEST_FILTER } from "../constants/plugins";
import type { TestplaneConfig } from "../types/testplaneConfig";

export default {
    name: TESTPLANE_TEST_FILTER,
    fn: (config: TestplaneConfig): void => {
        config.plugins![TESTPLANE_TEST_FILTER] = {
            __comment: "https://github.com/gemini-testing/testplane-test-filter",
            enabled: true,
            inputFile: "testplane-filter.json",
            __comment1: "Create a file testplane-filter.json",
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
