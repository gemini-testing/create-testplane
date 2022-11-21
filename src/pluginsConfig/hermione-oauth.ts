import { HERMIONE_OAUTH } from "../constants/plugins";
import type { HermioneConfig } from "../types/hermioneConfig";

export default {
    name: HERMIONE_OAUTH,
    fn: (config: HermioneConfig): void => {
        config.plugins![HERMIONE_OAUTH] = {
            __comment: "https://github.com/gemini-testing/hermione-oauth",
            enabled: true,
            __comment1: 'Please add "token" and "help" properties:',
            __comment2: 'token: "<token>" (or absolute filepath with a token)',
            __comment3: 'help: "https://..." (information on where to get a token)',
        };
    },
};
