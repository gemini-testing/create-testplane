import inquirer, { DistinctQuestion } from "inquirer";
import _ from "lodash";
import path from "path";

import { Colors } from "./colors";
import { pluginSuffixes } from "../constants/packageManagement";
import fsUtils from "../fsUtils";
import type { ConfigNote } from "../plugins";
import type { HermioneConfig } from "../types/hermioneConfig";
import type { ToolArgv } from "../types/toolArgv";
import type { ArgvOpts, GeneralPrompt, HandleGeneralPromptsCallback } from "../types/toolOpts";

export const optsFromArgv = (argv: ToolArgv): ArgvOpts => {
    if (!argv["_"].length) {
        console.info(Colors.fillYellow(`Initializing project in ${process.cwd()}`));
        argv["_"] = ["."];
    }

    const opts = {
        path: path.resolve(process.cwd(), argv["_"][0]),
        noQuestions: !!argv.yes,
    };
    return opts;
};

export const packageNameFromPlugin = (plugin: string): string => {
    for (const pluginSuffix of pluginSuffixes) {
        if (plugin.endsWith(pluginSuffix)) {
            return plugin.substring(0, plugin.length - pluginSuffix.length);
        }
    }

    return plugin;
};

export const askQuestion = async <T>(question: DistinctQuestion<Record<string, T>>): Promise<T> => {
    question.name = "key";
    const answers = await inquirer.prompt(question);

    return answers[question.name];
};

export const baseGeneralPromptsHandler: HandleGeneralPromptsCallback = async (hermioneConfig, answers) => {
    hermioneConfig.baseUrl = answers.baseUrl;
    hermioneConfig.gridUrl = answers.gridUrl;

    if (answers.addChromePhone) {
        const browserId = "chrome-phone";
        const version = await askQuestion({
            type: "input",
            message: "chrome-phone: Enter android chrome-phone version (ex: phone-67.1):",
        });
        _.mergeWith(
            hermioneConfig,
            {
                sets: {
                    "touch-phone": {
                        browsers: [browserId],
                        files: ["tests/**/*.hermione.js"],
                    },
                },
                browsers: {
                    [browserId]: {
                        desiredCapabilities: {
                            platformName: "Android",
                            deviceName: "android",
                            version,
                            browserName: "chrome",
                        },
                    },
                },
            },
            (objValue, srcValue) => (_.isArray(objValue) ? _.uniq(objValue.concat(srcValue)) : undefined),
        );
    }

    return hermioneConfig;
};

export const handleGeneralQuestions = async (
    generalPromts: GeneralPrompt[],
    hermioneConfig: HermioneConfig,
    handlePrompts: HandleGeneralPromptsCallback,
    noQuestions: boolean,
): Promise<HermioneConfig> => {
    if (!generalPromts) {
        return hermioneConfig;
    }

    const defaults = {};

    if (noQuestions) {
        generalPromts = generalPromts.filter(prompt => {
            if (prompt.default !== undefined) {
                _.set(defaults, prompt.name, prompt.default);
                return false;
            }
            return true;
        });
    }

    const answers = await inquirer.prompt(generalPromts);

    Object.assign(answers, defaults);

    return handlePrompts(hermioneConfig, answers);
};

export const printSuccessMessage = (configNotes: ConfigNote[]): void => {
    const successMessage = `
Inside that directory, you can run:

    ${Colors.fillTeal("npx hermione")}
      Runs hermione tests

    ${Colors.fillTeal("npx hermione gui")}
      Launches hermione's gui
    `;

    console.info(successMessage);

    if (configNotes.length) {
        console.info("You also need to complete the setup:");

        configNotes.forEach(note =>
            console.info(`
    ${Colors.fillYellow(packageNameFromPlugin(note.plugin))}
      ${note.configNote}
    `),
        );
    }
};

export const writeTestExample = async (dirPath: string): Promise<void> => {
    const testExample = `
describe('test', () => {
    it('example', async ({browser}) => {
        await browser.url('https://github.com/gemini-testing/hermione');

        const aboutElem = browser.$('.f4.my-3');
        const aboutText = await aboutElem.getText();
        console.log(aboutText); // Browser test runner based on mocha and wdio
    });
});
`;

    await fsUtils.writeTest(dirPath, "example.hermione.js", testExample);
};
