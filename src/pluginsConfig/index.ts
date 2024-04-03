import _ from "lodash";
import { PluginsConfig } from "../types/pluginsConfig";

import htmlReporter from "./html-reporter";
import testplaneRetryLimiter from "./testplane-retry-limiter";
import testplaneUrlDecorator from "./testplane-url-decorator";
import testplaneOauth from "./testplane-oauth";
import testplaneProfiler from "./testplane-profiler";
import testplaneStorybook from "./testplane-storybook";
import testplaneTestFilter from "./testplane-test-filter";
import testplaneTabsCloser from "./testplane-tabs-closer";
import testplaneGlobalHook from "./testplane-global-hook";
import testplaneTestRepeater from "./testplane-test-repeater";
import testplaneRetryCommand from "./testplane-retry-command";
import testplaneSafariCommands from "./testplane-safari-commands";
import testplaneHeadlessChrome from "./testplane-headless-chrome";
import testplanePluginsProfiler from "./testplane-plugins-profiler";
import testplaneRetryProgressive from "./testplane-retry-progressive";

const pluginsConfig = [
    htmlReporter,
    testplaneTestRepeater,
    testplaneRetryCommand,
    testplanePluginsProfiler,
    testplaneTabsCloser,
    testplaneRetryLimiter,
    testplaneSafariCommands,
    testplaneRetryProgressive,
    testplaneStorybook,
    testplaneProfiler,
    testplaneHeadlessChrome,
    testplaneUrlDecorator,
    testplaneTestFilter,
    testplaneOauth,
    testplaneGlobalHook,
].reduce((config: PluginsConfig, plugin) => _.set(config, plugin.name, plugin.fn), {});

export default pluginsConfig;
