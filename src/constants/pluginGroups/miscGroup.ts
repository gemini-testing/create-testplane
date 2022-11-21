import type { PluginGroup } from "../../types/toolOpts";
import {
    HERMIONE_GLOBAL_HOOK,
    HERMIONE_OAUTH,
    HERMIONE_TABS_CLOSER,
    HERMIONE_TEST_FILTER,
    URL_DECORATOR,
} from "../plugins";
import { HERMIONE_CONFIG_NAME } from "../packageManagement";

const miscGroup: PluginGroup = {
    description: "Misc (storybook addon, OAuth, url query params, test filter, tabs closer, global hooks)",
    plugins: [
        {
            description: "Set authorization header with OAuth token",
            plugin: HERMIONE_OAUTH,
            default: false,
            configNote: "Specify the OAuth token",
        },
        {
            description: "Add/replace url query params",
            plugin: URL_DECORATOR,
            default: false,
            configNote: "Specify the query params",
        },
        {
            description: "Only run specified tests in provided browsers",
            plugin: HERMIONE_TEST_FILTER,
            default: false,
            configNote: `Create hermione-filter.json on the example from "${HERMIONE_TEST_FILTER}" section in "${HERMIONE_CONFIG_NAME}"`,
        },
        {
            description: "Add global 'beforeEach' and 'afterEach' functions",
            plugin: HERMIONE_GLOBAL_HOOK,
            default: false,
            configNote: "Specify beforeEach and afterEach hooks",
        },
        {
            description: "Close opened tabs from previous tests so the browser coudn't degrade",
            plugin: HERMIONE_TABS_CLOSER,
            default: false,
            configNote: "Specify the browsers with regex",
        },
    ],
};

export default miscGroup;
