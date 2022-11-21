import { URL_DECORATOR } from "../constants/plugins";
import type { HermioneConfig } from "../types/hermioneConfig";

export default {
    name: URL_DECORATOR,
    fn: (config: HermioneConfig): void => {
        config.plugins![URL_DECORATOR] = {
            __comment: "https://github.com/gemini-testing/url-decorator",
            enabled: true,
            url: {
                query: {
                    __comment1: 'Write your entries like "text": "ololo" to add query param &text=ololo',
                    __comment2: 'You can also specify "mode": "override", if you need to overwrite existing param',
                },
            },
        };
    },
};
