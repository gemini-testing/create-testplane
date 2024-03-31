import { TESTPLANE_OAUTH } from "../constants/plugins";
import type { TestplaneConfig } from "../types/testplaneConfig";

export default {
    name: TESTPLANE_OAUTH,
    fn: (config: TestplaneConfig): void => {
        config.plugins![TESTPLANE_OAUTH] = {
            __comment: "https://github.com/gemini-testing/testplane-oauth",
            enabled: true,
            __comment1: 'Please add "token" and "help" properties:',
            __comment2: 'token: "<token>" (or absolute filepath with a token)',
            __comment3: 'help: "https://..." (information on where to get a token)',
        };
    },
};
