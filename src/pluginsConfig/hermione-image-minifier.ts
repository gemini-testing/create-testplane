import { HERMIONE_IMAGE_MINIFIER } from "../constants/plugins";
import type { HermioneConfig } from "../types/hermioneConfig";

export default {
    name: HERMIONE_IMAGE_MINIFIER,
    fn: (config: HermioneConfig): void => {
        config.plugins![HERMIONE_IMAGE_MINIFIER] = {
            __comment: "https://github.com/gemini-testing/hermione-image-minifier",
            enabled: true,
            __comment2: "set value from 0 (zero compression, fast) to 7 (max compression, slow)",
            compressionLevel: 2,
        };
    },
};
