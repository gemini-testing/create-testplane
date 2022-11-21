import type { PluginGroup } from "../../types/toolOpts";
import {
    HERMIONE_REASSERT_VIEW,
    HERMIONE_RETRY_COMMAND,
    RETRY_LIMITER,
    HERMIONE_RETRY_PROGRESSIVE,
    HERMIONE_TEST_REPEATER,
} from "../plugins";

const unstableGroup: PluginGroup = {
    description: "Increase stability of unstable tests",
    plugins: [
        {
            description: "Make screenshot comparison by assertView less strict",
            plugin: HERMIONE_REASSERT_VIEW,
            default: false,
        },
        {
            description: "Retry assertView on comparison fail",
            plugin: HERMIONE_RETRY_COMMAND,
            default: false,
        },
        {
            description: "Add extra retry if test fails due to infrastructure reasons",
            plugin: HERMIONE_RETRY_PROGRESSIVE,
            default: false,
            configNote: "Specify regex to match error",
        },
        {
            description: "Repeat tests the specified number of times regardless of the result",
            plugin: HERMIONE_TEST_REPEATER,
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
