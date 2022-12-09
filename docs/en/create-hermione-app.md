# create-hermione-app

A tool for fast creation and configuration [hermione](https://github.com/gemini-testing/hermione) app.
Can also be used to add [hermione](https://github.com/gemini-testing/hermione) in your existing project.

## Quick Overview

```bash
npx create-hermione-app my-app
```

or via `npm init`:

```bash
npm init hermione-app my-app
```

Without specifying the path, project will be created in the current directory.
If you already have a project at given path, the tool will try to guess used package manager.

## Zero questions mode

You can add `-y` or `--yes` argument to launch a tool in *no-questions* mode.
In this mode you won't be asked questions about desired plugins and packet manager.

Default packet manager, used with `--yes` argument: `npm`

Default plugins, installed with `--yes` argument: 
- [html-reporter](https://github.com/gemini-testing/html-reporter)

## List of all proposed plugins

- [hermione-global-hook](https://github.com/gemini-testing/hermione-global-hook)
- [hermione-plugins-profiler](https://github.com/gemini-testing/hermione-plugins-profiler)
- [hermione-retry-progressive](https://github.com/gemini-testing/hermione-retry-progressive)
- [hermione-test-filter](https://github.com/gemini-testing/hermione-test-filter)
- [retry-limiter](https://github.com/gemini-testing/retry-limiter)
- [hermione-headless-chrome](https://github.com/gemini-testing/hermione-headless-chrome)
- [hermione-profiler](https://github.com/gemini-testing/hermione-profiler)
- [hermione-safari-commands](https://github.com/gemini-testing/hermione-safari-commands)
- [hermione-test-repeater](https://github.com/gemini-testing/hermione-test-repeater)
- [url-decorator](https://github.com/gemini-testing/url-decorator)
- [hermione-image-minifier](https://github.com/gemini-testing/hermione-image-minifier)
- [hermione-reassert-view](https://github.com/gemini-testing/hermione-reassert-view)
- [hermione-storybook](https://github.com/gemini-testing/hermione-storybook)
- [html-reporter](https://github.com/gemini-testing/html-reporter)
- [hermione-oauth](https://github.com/gemini-testing/hermione-oauth)
- [hermione-retry-command](https://github.com/gemini-testing/hermione-retry-command)
- [hermione-tabs-closer](https://github.com/gemini-testing/hermione-tabs-closer)

## Customizing the tool

`create-hermione-app` can be configured to your personal needs:

```ts
import createHermioneApp from "create-hermione-app";

createHermioneApp.run({
    createOpts,
    createBaseConfig,
    generalPrompts,
    createPluginsConfig
});
```

*Note: you are only allowed to put serializable data to hermioneConfig*

### Parameters

#### createOpts (required)

Default tool's CLI handles given path and `--yes` argument. In this callback you need to at least specify `path` and `noQuestions` values:

```ts
import type { DefaultOpts } from "create-hermione-app/types/toolOpts";

const argvOpts = {
    path: ".",
    noQuestions: false
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
import type { HermioneConfig } from "create-hermione-app/types/hermioneConfig";

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
import type { GeneralPrompt, HandleGeneralPromptsCallback } from "create-hermione-app/types/toolOpts";

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

### Adding custom plugin

Firstly, you need to include your plugin into existing pluginGroup, or create your own:

```ts
import type {
    DefaultOpts,
    GeneralPrompt,
    PluginPrompt
} from "create-hermione-app/types/toolOpts";

const createOpts = (defaultOpts: DefaultOpts) => {
    const customPluginPrompt: PluginPrompt = {
        // Plugin name. The tool will try to download this with picked package manager
        // Suffixes "/plugin" and "/hermione" will be removed on downloading
        plugin: "my-custom-plugin-name",
        // Plugin description
        description: "Adds some custom feature",
        // Should it be installed in "zero question" mode
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