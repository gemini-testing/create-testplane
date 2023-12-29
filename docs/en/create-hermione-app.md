# create-hermione-app

Use `create-hermione-app` to set up [hermione](https://github.com/gemini-testing/hermione) quickly and conveniently both in a new and in an existing project.

## Usage

```bash
npx create-hermione-app my-app
```

or via `npm init`:

```bash
npm init hermione-app my-app
```

<img src="../assets/usage.gif"/>

Without specifying the path, project will be created in the current directory.

If you already have a project at given path, the tool will try to guess used package manager.

### No questions mode

You can add `-y` or `--yes` argument to launch a tool in *no-questions* mode.

In this mode you won't be asked questions about desired plugins and packet manager.

Default packet manager, used with `--yes` argument: `npm`

Default plugins, installed with `--yes` argument: 
- [html-reporter](https://github.com/gemini-testing/html-reporter)

## List of proposed plugins

- [Global Hook](https://github.com/gemini-testing/hermione-global-hook) - To add global 'beforeEach' and 'afterEach' functions
- [Plugins Profiler](https://github.com/gemini-testing/hermione-plugins-profiler) - To profile plugins performance
- [Retry Progressive](https://github.com/gemini-testing/hermione-retry-progressive) - To add extra retry if test fails due to infrastructure reasons
- [Test Filter](https://github.com/gemini-testing/hermione-test-filter) - To run only specified tests in provided browsers
- [Retry Limiter](https://github.com/gemini-testing/retry-limiter) - To limit retries and duration threshold
- [Headless Chrome](https://github.com/gemini-testing/hermione-headless-chrome) - To add and install headless chrome browser
- [Profiler](https://github.com/gemini-testing/hermione-profiler) - To generate report about executed commands and their performance
- [Safari Commands](https://github.com/gemini-testing/hermione-safari-commands) - To add compatibility for safari mobile
- [Test Repeater](https://github.com/gemini-testing/hermione-test-repeater) - To repeat tests the specified number of times regardless of the result
- [Url Decorator](https://github.com/gemini-testing/url-decorator) - To add/replace url query params
- [Image Minifier](https://github.com/gemini-testing/hermione-image-minifier) - To enable compression for reference images
- [Reassert View](https://github.com/gemini-testing/hermione-reassert-view) - To make screenshot comparison by assertView less strict
- [Storybook](https://github.com/gemini-testing/hermione-storybook) - To add ability to write hermione tests on storybook component and speed up their execution
- [Html Reporter](https://github.com/gemini-testing/html-reporter) - To generate html-reports for showing passed/failed tests, screenshot diffs, error messages, stacktraces, meta-info and so on
- [Oauth](https://github.com/gemini-testing/hermione-oauth) - To set authorization header with OAuth token
- [Retry Command](https://github.com/gemini-testing/hermione-retry-command) - To retry assertView on comparison fail
- [Tabs Closer](https://github.com/gemini-testing/hermione-tabs-closer) - To close opened tabs from previous tests so the browser coudn't degrade

## Customizing the tool

You can create your own node-js script based on `create-hermione-app` to deploy the configuration.

This may be necessary, for example, if you have internal hermione plugins distributed for projects within the company.

```ts
import createHermioneApp from "create-hermione-app";

createHermioneApp.run({
    createOpts,
    createBaseConfig,
    generalPrompts,
    createPluginsConfig
});
```

*Note: you are only allowed to put serializable data to hermioneConfig*.

### Parameters

#### createOpts

**Required parameter**

Default tool's CLI handles given path and `--yes` argument. In this callback you need to at least specify `path` and `noQuestions` values:

```ts
import type { DefaultOpts } from "create-hermione-app";

const argvOpts = {
    path: ".",
    noQuestions: true
};

const createOpts = (defaultOpts: DefaultOpts) => {
    const opts = Object.assign({}, argvOpts, defaultOpts);

    return opts;
};
```

You can also change `defaultOpts`. Currently it has `pluginGroups` key to define how plugins are divided into groups.

#### createBaseConfig

The tool creates a base hermione config, and then mutates it. You can change this base config:

```ts
import type { HermioneConfig } from "create-hermione-app";

const createBaseConfig = (baseConfig: HermioneConfig) => {
    baseConfig.takeScreenshotOnFails = {
        testFail: true,
        assertViewFail: false
    };

    return baseConfig;
}
```

#### generalPrompts

You can add custom questions and handle user answers to mutate `hermioneConfig`

```ts
import type { GeneralPrompt, HandleGeneralPromptsCallback } from "create-hermione-app";

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

const promptHandler: HandleGeneralPromptsCallback = (hermioneConfig, answers) => {
    answers.retry = answers.retryCount;

    if (answers.ignoreFiles) {
        const sets = Object.values(hermioneConfig.sets || {});
        for (const testSet of sets) {
            testSet.ignoreFiles = testSet.ignoreFiles || [];
            testSet.ignoreFiles.push(answers.ignoreFiles);
        }
    }

    return hermioneConfig;
}

const generalPrompts = {
    prompts: [promptRetries, promptIgnoreFiles],
    handler: promptHandler
}
```

If `GeneralPrompt` does not have `default` value, the question will be asked even with `noQuestions: true`

#### createPluginsConfig

You can also change how enabling plugins affects the `.hermione.conf.js` file

```ts
import type { CreatePluginsConfigCallback } from "create-hermione-app";

const createPluginsConfig: CreatePluginsConfigCallback = (pluginsConfig) => {
    pluginsConfig["hermione-retry-progressive"] = (hermioneConfig) => {
        hermioneConfig.plugins!["hermione-retry-progressive"] = {
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
import createHermioneApp from "create-hermione-app";

createHermioneApp.run({
    registry: "https://registry.npmjs.org", // default value
});
```

### Adding custom plugin

Firstly, you need to include your plugin into existing `pluginGroup`, or create your own:

```ts
import type {
    DefaultOpts,
    GeneralPrompt,
    PluginPrompt
} from "create-hermione-app";

const createOpts = (defaultOpts: DefaultOpts) => {
    const customPluginPrompt: PluginPrompt = {
        // Plugin name. The tool will try to download this with picked package manager
        // Suffixes "/plugin" and "/hermione" will be removed on downloading
        plugin: "my-custom-plugin-name",
        // Plugin description
        description: "Adds some custom feature",
        // Should it be installed in "no question" mode
        default: false,
        // If the plugin requires additional configuration. Optional
        configNote: "Specify something in hermione config"
    };

    defaultOpts.pluginGroups.push({
        description: "Custom plugin group",
        plugins: [customPluginPrompt]
    });

    return {
        ...defaultOpts,
        path: ".",
        noQuestions: false
    };
};
```

Then you need to define, how including your plugin will affect the `.hermione.conf.js` file

```ts
import type { CreatePluginsConfigCallback } from "create-hermione-app";

const createPluginsConfig: CreatePluginsConfigCallback = (pluginsConfig) => {
    pluginsConfig["my-custom-plugin-name"] = (hermioneConfig) => {
        // Usualy you would want to describe your plugin's default config
        hermioneConfig.plugins!["my-custom-plugin-name"] = {
            enabled: true,
        };
        // But you can also do anything else with hermioneConfig
        hermioneConfig.browsers["my-custom-browser"] = {
            desiredCapabilities: {
                browserName: "browserName"
            }
        }
    }

    return pluginsConfig;
}
```
