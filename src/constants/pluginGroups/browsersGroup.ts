import type { PluginGroup } from "../../types/toolOpts";
import { HERMIONE_HEADLESS_CHROME, HERMIONE_SAFARI_COMMANDS } from "../plugins";

const browsersGroup: PluginGroup = {
    description: "Add different browser support (mobile, headless-chrome)",
    plugins: [
        {
            description: "Add and install headless chrome browser",
            plugin: HERMIONE_HEADLESS_CHROME,
            default: false,
        },
        {
            description: "Add compatibility for safari mobile",
            plugin: HERMIONE_SAFARI_COMMANDS,
            default: false,
        },
    ],
};

export default browsersGroup;
