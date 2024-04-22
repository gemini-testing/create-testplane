import type { PluginGroup } from "../../types/toolOpts";
import { TESTPLANE_PLUGINS_PROFILER, TESTPLANE_PROFILER, TESTPLANE_STORYBOOK, HTML_REPORTER } from "../plugins";

const reportsGroup: PluginGroup = {
    description: "Generate reports about tests' results, plugins, their performance",
    plugins: [
        {
            description:
                "Generate html-reports for showing passed/failed tests, screenshot diffs, error messages, stacktraces, meta-info and so on",
            plugin: HTML_REPORTER,
            default: true,
        },
        {
            description: "Generate report about executed commands and their performance",
            plugin: TESTPLANE_PROFILER,
            default: false,
        },
        {
            description: "Profile plugins performance",
            plugin: TESTPLANE_PLUGINS_PROFILER,
            default: false,
        },
        {
            description: "Add ability to autogenerate screenshot testplane tests on storybook components in runtime",
            plugin: TESTPLANE_STORYBOOK,
            default: false,
        },
    ],
};

export default reportsGroup;
