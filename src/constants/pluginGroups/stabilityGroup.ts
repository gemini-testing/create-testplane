import type { PluginGroup } from "../../types/toolOpts";
import {
    TESTPLANE_REASSERT_VIEW,
    TESTPLANE_RETRY_COMMAND,
    RETRY_LIMITER,
    TESTPLANE_RETRY_PROGRESSIVE,
    TESTPLANE_TEST_REPEATER,
} from "../plugins";

const unstableGroup: PluginGroup = {
    description: "Increase stability of unstable tests",
    plugins: [
        {
            description: "Make screenshot comparison by assertView less strict",
            plugin: TESTPLANE_REASSERT_VIEW,
            default: false,
        },
        {
            description: "Retry assertView on comparison fail",
            plugin: TESTPLANE_RETRY_COMMAND,
            default: false,
        },
        {
            description: "Add extra retry if test fails due to infrastructure reasons",
            plugin: TESTPLANE_RETRY_PROGRESSIVE,
            default: false,
            configNote: "Specify regex to match error",
        },
        {
            description: "Repeat tests the specified number of times regardless of the result",
            plugin: TESTPLANE_TEST_REPEATER,
            default: false,
        },
        {
            description: "Limit retries and duration threshold",
            plugin: RETRY_LIMITER,
            default: false,
        },
    ],
};

export default unstableGroup;
