import _ from "lodash";
import { PluginsConfig } from "../types/pluginsConfig";

import htmlReporter from "./html-reporter";
import retryLimiter from "./retry-limiter";
import urlDecorator from "./url-decorator";
import hermioneOauth from "./hermione-oauth";
import hermioneProfiler from "./hermione-profiler";
import hermioneStorybook from "./hermione-storybook";
import hermioneTestFilter from "./hermione-test-filter";
import hermioneTabsCloser from "./hermione-tabs-closer";
import hermioneGlobalHook from "./hermione-global-hook";
import hermioneTestRepeater from "./hermione-test-repeater";
import hermioneRetryCommand from "./hermione-retry-command";
import hermioneSafariCommands from "./hermione-safari-commands";
import hermioneHeadlessChrome from "./hermione-headless-chrome";
import hermionePluginsProfiler from "./hermione-plugins-profiler";
import hermioneRetryProgressive from "./hermione-retry-progressive";

const pluginsConfig = [
    htmlReporter,
    hermioneTestRepeater,
    hermioneRetryCommand,
    hermionePluginsProfiler,
    hermioneTabsCloser,
    retryLimiter,
    hermioneSafariCommands,
    hermioneRetryProgressive,
    hermioneStorybook,
    hermioneProfiler,
    hermioneHeadlessChrome,
    urlDecorator,
    hermioneTestFilter,
    hermioneOauth,
    hermioneGlobalHook,
].reduce((config: PluginsConfig, plugin) => _.set(config, plugin.name, plugin.fn), {});

export default pluginsConfig;
