# create-hermione-app

Инструмент для быстрого создания и конфигурации проекта, использующего [hermione](https://github.com/gemini-testing/hermione).
Также может быть использован чтобы добавить [hermione](https://github.com/gemini-testing/hermione) в уже существующий проект.

## Краткий обзор

```bash
npx create-hermione-app my-app
```

Или через `npm init`:

```bash
npm init hermione-app my-app
```

Если не указать путь, проект будет развернут в текущей директории.
Если по указанному пути уже имеется проект, инструмент попробует определить используемый пакетный менеджер, и будет использовать его для установки пакетов.

## Режим "по умолчанию"

Вы можете добавить аргумент `-y` или `--yes` чтобы запустить инструмент в режиме "без вопросов".
В этом режиме у вас не будут спрашивать о желаемых плагинах и пакетном менеджере.

Пакетный менеджер по умолчанию, используемый с аргументом `--yes`: `npm`

Плагины по умолчанию, устанавливаемые с аргументом `--yes`: 
- [html-reporter](https://github.com/gemini-testing/html-reporter)

## Список всех предлагаемых плагинов

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

## Кастомизация инструмента

`create-hermione-app` может быть настроен под ваши персональные нужды:

```ts
import createHermioneApp from "create-hermione-app";

createHermioneApp.run({
    createOpts,
    createBaseConfig,
    generalPrompts,
    createPluginsConfig
});
```

*Примечание: в `hermioneConfig` можно класть только сериализуемые данные*

### Параметры

#### createOpts (обязателен)

Консольный интерфейс по умолчанию обрабатывает данный путь и аргумент `--yes`. В этом коллбэке вам необходимо указать как минимум значения `path` и `noQuestions`:

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
Вы также можете изменить `defaultOpts` Сейчас этот объект имеет ключ `pluginGroups`, по которому определяет, как плагины разбиваются на группы.

#### createBaseConfig

Инструмент создает базовый конфиг гермионы, который затем мутирует. Вы можете изменить этот базовый конфиг:

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

Вы также можете добавить общих задаваемых вопросов и обработать пользовательские ответы для изменения `hermioneConfig`

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

Если у GeneralPrompt не указать значение по умолчанию, вопрос будет задан даже при `noQuestions: true`

#### createPluginsConfig

Вы также можете изменить, как включение плагинов влияет на `.hermione.conf.js`

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

### Добавление кастомного плагина

Для начала вам необходимо включить свой плагин в существующую группу плагинов, или создать свою:

```ts
import type {
    DefaultOpts,
    GeneralPrompt,
    PluginPrompt
} from "create-hermione-app/types/toolOpts";

const createOpts = (defaultOpts: DefaultOpts) => {
    const customPluginPrompt: PluginPrompt = {
        // Имя плагина. Инструмент попытается загрузить его выбранным пакетнм менеджером
        // Суффиксы "/plugin" и "/hermione" будут удалены при загрузке
        plugin: "my-custom-plugin-name",
        // Описание плагина
        description: "Adds some custom feature",
        // Должен ли плагин быть установлен в режиме "по умолчанию"
        default: false,
        // Если плагин требует дополнительной настройки. Опционально
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

Затем вам необходимо определить, как включение плагина влияет на `.hermione.conf.js`

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