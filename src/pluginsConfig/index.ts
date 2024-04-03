import _ from "lodash";
import { PluginsConfig } from "../types/pluginsConfig";

import htmlReporter from "./html-reporter";
import retryLimiter from "./retry-limiter";
import urlDecorator from "./url-decorator";
import testplaneOauth from "./testplane-oauth";
import testplaneProfiler from "./testplane-profiler";
import testplaneStorybook from "./testplane-storybook";
import testplaneTestFilter from "./testplane-test-filter";
import testplaneTabsCloser from "./testplane-tabs-closer";
import testplaneGlobalHook from "./testplane-global-hook";
import testplaneTestRepeater from "./testplane-test-repeater";
import testplaneRetryCommand from "./testplane-retry-command";
import testplaneReassertView from "./testplane-reassert-view";
import testplaneSafariCommands from "./testplane-safari-commands";
import testplaneHeadlessChrome from "./testplane-headless-chrome";
import testplanePluginsProfiler from "./testplane-plugins-profiler";
import testplaneRetryProgressive from "./testplane-retry-progressive";

const pluginsConfig = [
    htmlReporter,
    testplaneTestRepeater,
    testplaneRetryCommand,
    testplaneReassertView,
    testplanePluginsProfiler,
    testplaneTabsCloser,
    retryLimiter,
    testplaneSafariCommands,
    testplaneRetryProgressive,
    testplaneStorybook,
    testplaneProfiler,
    testplaneHeadlessChrome,
    urlDecorator,
    testplaneTestFilter,
    testplaneOauth,
    testplaneGlobalHook,
].reduce((config: PluginsConfig, plugin) => _.set(config, plugin.name, plugin.fn), {});

export default pluginsConfig;
