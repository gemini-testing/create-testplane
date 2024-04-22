# create-testplane

Use `create-testplane` to set up [testplane](https://github.com/gemini-testing/testplane) quickly and conveniently both in a new and in an existing project.

## Usage

```bash
npm init testplane my-app
```

<img src="../assets/usage.gif"/>

Without specifying the path, project will be created in the current directory.

If you already have a project at given path, the tool will try to guess used package manager.

### Extra questions mode

By default, project will be created with zero questions.

You can add `-v` or `--verbose` argument to launch a tool in *extra-questions* mode, to pick custom package manager or pick extra plugins:

```bash
npm init testplane my-app -- -v
```

In this mode you won't be asked questions about desired plugins and packet manager.

Default packet manager, used without `--verbose` argument: `npm`

Default plugins, installed without `--verbose` argument:
- [html-reporter](https://github.com/gemini-testing/html-reporter)

### Lang

By default, create-testplane sets up project with typescript tests support.

You can opt-out of typescript by adding `--lang js` argument:

```bash
npm init testplane my-app -- --lang js
```

## List of proposed plugins

- [Global Hook](https://github.com/gemini-testing/testplane-global-hook) - To add global 'beforeEach' and 'afterEach' functions
- [Plugins Profiler](https://github.com/gemini-testing/testplane-plugins-profiler) - To profile plugins performance
- [Retry Progressive](https://github.com/gemini-testing/testplane-retry-progressive) - To add extra retry if test fails due to infrastructure reasons
- [Test Filter](https://github.com/gemini-testing/testplane-test-filter) - To run only specified tests in provided browsers
- [Retry Limiter](https://github.com/gemini-testing/testplane-retry-limiter) - To limit retries and duration threshold
- [Headless Chrome](https://github.com/gemini-testing/testplane-headless-chrome) - To add and install headless chrome browser
- [Profiler](https://github.com/gemini-testing/testplane-profiler) - To generate report about executed commands and their performance
- [Safari Commands](https://github.com/gemini-testing/testplane-safari-commands) - To add compatibility for safari mobile
- [Test Repeater](https://github.com/gemini-testing/testplane-test-repeater) - To repeat tests the specified number of times regardless of the result
- [Url Decorator](https://github.com/gemini-testing/testplane-url-decorator) - To add/replace url query params
- [Storybook](https://github.com/gemini-testing/testplane-storybook) - To add ability to write testplane tests on storybook component and speed up their execution
- [Html Reporter](https://github.com/gemini-testing/html-reporter) - To generate html-reports for showing passed/failed tests, screenshot diffs, error messages, stacktraces, meta-info and so on
- [Oauth](https://github.com/gemini-testing/testplane-oauth) - To set authorization header with OAuth token
- [Retry Command](https://github.com/gemini-testing/testplane-retry-command) - To retry assertView on comparison fail
- [Tabs Closer](https://github.com/gemini-testing/testplane-tabs-closer) - To close opened tabs from previous tests so the browser coudn't degrade

## Customizing the tool

You can create your own Node.js script based on `create-testplane` to deploy the configuration.

This may be necessary, for example, if you have internal testplane plugins distributed for projects within the company.

```ts
import createTestplane from "create-testplane";

createTestplane.run({
    createOpts,
    createBaseConfig,
    generalPrompts,
    generalPromptsHandler,
    createPluginsConfig,
    getExtraPackagesToInstall,
    getTestExample,
    registry
});
```

*Note: you are only allowed to put serializable data to testplaneConfig*.

### Parameters

#### createOpts

**Required parameter**

Default tool's CLI handles given path and `--verbose` argument. In this callback you need to at least specify `path` and `extraQuestions` values:

```ts
import type { DefaultOpts } from "create-testplane";

const argvOpts = {
    path: ".",
    extraQuestions: false
};

const createOpts = (defaultOpts: DefaultOpts) => {
    const opts = Object.assign({}, argvOpts, defaultOpts);

    return opts;
};
```

You can also change `defaultOpts`. Currently it has `pluginGroups` key to define how plugins are divided into groups.

#### createBaseConfig

The tool creates a base testplane config, and then mutates it. You can change this base config:

```ts
import type { testplaneConfig, CreateBaseConfigOpts } from "create-testplane";

const createBaseConfig = (baseConfig: TestplaneConfig, opts: CreateBaseConfigOpts) => {
    baseConfig.takeScreenshotOnFails = {
        testFail: true,
        assertViewFail: false
    };

    return baseConfig;
}
```

#### generalPrompts

You can remove, add custom questions, handle user answers to mutate `testplaneConfig`

```ts
import type { GeneralPrompt, HandleGeneralPromptsCallback, baseGeneralPrompts } from "create-testplane";

const promptRetries: GeneralPrompt = {
    type: "number",
    name: "retryCount",
    message: "How many times do you want to retry a failed test?",
    default: 0,
};

const promptIgnoreFiles: GeneralPrompt = {
    type: "input",
    name: "ignoreFiles",
    message: "Enter a pattern to ignore files",
    default: null,
};

const generalPrompts = [...baseGeneralPrompts, promptRetries, promptIgnoreFiles];

const generalPromptsHandler: HandleGeneralPromptsCallback = (testplaneConfig, answers) => {
    answers.retry = answers.retryCount;

    if (answers.ignoreFiles) {
        const sets = Object.values(testplaneConfig.sets || {});
        for (const testSet of sets) {
            testSet.ignoreFiles = testSet.ignoreFiles || [];
            testSet.ignoreFiles.push(answers.ignoreFiles);
        }
    }

    return testplaneConfig;
};
```

If `GeneralPrompt` does not have `default` value, the question will be asked with `extraQuestions: false`

#### createPluginsConfig

You can also change how enabling plugins affects the `.testplane.conf.js` file

```ts
import type { CreatePluginsConfigCallback } from "create-testplane";

const createPluginsConfig: CreatePluginsConfigCallback = (pluginsConfig) => {
    pluginsConfig["testplane-retry-progressive"] = (testplaneConfig) => {
        testplaneConfig.plugins!["testplane-retry-progressive"] = {
            enabled: true,
            extraRetry: 7,
            errorPatterns: [
                "Parameter .* must be a string",
                {
                    name: "Cannot read property of undefined",
                    pattern: "Cannot read property .* of undefined",
                },
            ],
        };
    }

    return pluginsConfig;
}
```

#### registry

You can also define registry, which will be used to install packages

```ts
import createTestplane from "create-testplane";

createTestplane.run({
    registry: "https://registry.npmjs.org", // default value
});
```

#### getExtraPackagesToInstall

You can also pass extra packages, which will be installed with `testplane` unconditionally

```ts
import type { GetExtraPackagesToInstallCallback } from "create-testplane";

const getExtraPackagesToInstall: GetExtraPackagesToInstallCallback = () => ({
    names: ["chai"],
    notes: []
});
```

### Adding custom plugin

Firstly, you need to include your plugin into existing `pluginGroup`, or create your own:

```ts
import type {
    DefaultOpts,
    GeneralPrompt,
    PluginPrompt
} from "create-testplane";

const createOpts = (defaultOpts: DefaultOpts) => {
    const customPluginPrompt: PluginPrompt = {
        // Plugin name. The tool will try to download this with picked package manager
        // Suffixes "/plugin" and "/testplane" will be removed on downloading
        plugin: "my-custom-plugin-name",
        // Plugin description
        description: "Adds some custom feature",
        // Should it be installed in "no question" mode
        default: false,
        // If the plugin requires additional configuration. Optional
        configNote: "Specify something in testplane config"
    };

    defaultOpts.pluginGroups.push({
        description: "Custom plugin group",
        plugins: [customPluginPrompt]
    });

    return {
        ...defaultOpts,
        path: ".",
        extraQuestions: false
    };
};
```

Then you need to define, how including your plugin will affect the `.testplane.conf.js` file

```ts
import type { CreatePluginsConfigCallback } from "create-testplane";

const createPluginsConfig: CreatePluginsConfigCallback = (pluginsConfig) => {
    pluginsConfig["my-custom-plugin-name"] = (testplaneConfig) => {
        // Usualy you would want to describe your plugin's default config
        testplaneConfig.plugins!["my-custom-plugin-name"] = {
            enabled: true,
        };
        // But you can also do anything else with testplaneConfig
        testplaneConfig.browsers["my-custom-browser"] = {
            desiredCapabilities: {
                browserName: "browserName"
            }
        }
    }

    return pluginsConfig;
}
```
