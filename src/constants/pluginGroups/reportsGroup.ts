import type { PluginGroup } from "../../types/toolOpts";
import { HERMIONE_PLUGINS_PROFILER, HERMIONE_PROFILER, HERMIONE_STORYBOOK, HTML_REPORTER } from "../plugins";

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
            plugin: HERMIONE_PROFILER,
            default: false,
        },
        {
            description: "Profile plugins performance",
            plugin: HERMIONE_PLUGINS_PROFILER,
            default: false,
        },
        {
            description: "Add ability to write hermione tests on storybook component and speed up their execution",
            plugin: HERMIONE_STORYBOOK,
            default: false,
        },
    ],
};

export default reportsGroup;
