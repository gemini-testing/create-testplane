import inquirer, { DistinctQuestion } from "inquirer";
import _ from "lodash";
import path from "path";

import { Colors } from "./colors";
import { pluginSuffixes } from "../constants/packageManagement";
import fsUtils from "../fsUtils";
import type { ConfigNote } from "../plugins";
import type { ToolArgv } from "../types/toolArgv";
import type { ArgvOpts, HandleGeneralPromptsCallback } from "../types/toolOpts";
import type { HermioneConfig, Language } from "../types";
import { defaultHermioneTestsDir } from "../constants/defaultHermioneConfig";

export const optsFromArgv = (argv: ToolArgv): ArgvOpts => {
    if (!argv["_"].length) {
        console.info(Colors.fillYellow(`Initializing project in ${process.cwd()}`));
        argv["_"] = ["."];
    }

    return {
        path: path.resolve(process.cwd(), argv["_"][0]),
        language: argv.lang === "js" ? "js" : "ts",
        noQuestions: Boolean(argv.yes),
    };
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
    if (_.isString(answers.baseUrl)) {
        hermioneConfig.baseUrl = answers.baseUrl;
    }

    if (_.isString(answers.gridUrl)) {
        hermioneConfig.gridUrl = answers.gridUrl;
    }

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

export const writeTestExample = async (dirPath: string, ext: Language): Promise<void> => {
    const testExample = `
describe("test", () => {
    it("example", async ({browser}) => {
        await browser.url("https://github.com/gemini-testing/hermione");

        await expect(browser.$(".f4.my-3")).toHaveText("Browser test runner based on mocha and wdio");
    });
});
`;

    await fsUtils.writeTest(dirPath, `example.hermione.${ext}`, testExample);
};

const asString = (str: string, quote: string): string => {
    const escapedString = str.replace(new RegExp(quote, "gi"), `\\${quote}`);

    return quote + escapedString + quote;
};

type VariableOpts = {
    name: string;
    value: string;
    isExpr?: boolean;
};

export const defineVariable = (config: HermioneConfig, { name, value, isExpr }: VariableOpts): HermioneConfig => {
    const quote = _.get(config, ["__template", "quote"], "'");

    return _.set(config, ["__variables", name], isExpr ? value : asString(value, quote));
};

export const addModule = (config: HermioneConfig, variableName: string, moduleName = variableName): HermioneConfig => {
    return _.set(config, ["__modules", variableName], moduleName);
};

export const asExpression = (value: string): string => `__expression: ${value}`;

export const extendWithTypescript = async (packageNamesToInstall: string[], appPath: string): Promise<void> => {
    packageNamesToInstall.push("ts-node");

    const hermioneTsConfigPath = path.join(appPath, defaultHermioneTestsDir, "tsconfig.json");
    const defaultHermioneTsConfig = _.set({}, ["compilerOptions", "types"], ["hermione"]);

    await fsUtils.writeJson(hermioneTsConfigPath, defaultHermioneTsConfig);
};
