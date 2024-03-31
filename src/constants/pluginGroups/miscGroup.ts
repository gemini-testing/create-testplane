import type { PluginGroup } from "../../types/toolOpts";
import {
    TESTPLANE_GLOBAL_HOOK,
    TESTPLANE_OAUTH,
    TESTPLANE_TABS_CLOSER,
    TESTPLANE_TEST_FILTER,
    URL_DECORATOR,
} from "../plugins";

const miscGroup: PluginGroup = {
    description: "Misc (storybook addon, OAuth, url query params, test filter, tabs closer, global hooks)",
    plugins: [
        {
            description: "Set authorization header with OAuth token",
            plugin: TESTPLANE_OAUTH,
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
            plugin: TESTPLANE_TEST_FILTER,
            default: false,
            configNote: `Create testplane-filter.json on the example from "${TESTPLANE_TEST_FILTER}" section in Testplane config`,
        },
        {
            description: "Add global 'beforeEach' and 'afterEach' functions",
            plugin: TESTPLANE_GLOBAL_HOOK,
            default: false,
            configNote: "Specify beforeEach and afterEach hooks",
        },
        {
            description: "Close opened tabs from previous tests so the browser coudn't degrade",
            plugin: TESTPLANE_TABS_CLOSER,
            default: false,
            configNote: "Specify the browsers with regex",
        },
    ],
};

export default miscGroup;
