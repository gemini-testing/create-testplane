import type { PluginGroup } from "../../types/toolOpts";
import { TESTPLANE_HEADLESS_CHROME, TESTPLANE_SAFARI_COMMANDS } from "../plugins";

const browsersGroup: PluginGroup = {
    description: "Add different browser support (mobile, headless-chrome)",
    plugins: [
        {
            description: "Add and install headless chrome browser",
            plugin: TESTPLANE_HEADLESS_CHROME,
            default: false,
        },
        {
            description: "Add compatibility for safari mobile",
            plugin: TESTPLANE_SAFARI_COMMANDS,
            default: false,
        },
    ],
};

export default browsersGroup;
