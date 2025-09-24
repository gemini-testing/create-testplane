import _ from "lodash";
import path from "path";

import { inquirerPrompt } from "./inquirer";
import { Colors } from "./colors";
import { pluginSuffixes } from "../constants/packageManagement";
import fsUtils from "../fsUtils";
import { defaultTestplaneTestsDir } from "../constants/defaultTestplaneConfig";
import type { ConfigNote } from "../plugins";
import type { ToolArgv } from "../types/toolArgv";
import type { ArgvOpts, HandleGeneralPromptsCallback } from "../types/toolOpts";
import type { TestplaneConfig, Language } from "../types";

export { inquirerPrompt } from "./inquirer";

export const optsFromArgv = (argv: ToolArgv): ArgvOpts => {
    if (!argv["_"].length) {
        console.info(Colors.fillYellow(`Initializing project in ${process.cwd()}`));
        argv["_"] = ["."];
    }

    return {
        path: path.resolve(process.cwd(), argv["_"][0]),
        language: argv.lang === "js" ? "js" : "ts",
        extraQuestions: Boolean(argv.verbose),
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

export const baseGeneralPromptsHandler: HandleGeneralPromptsCallback = async (testplaneConfig, answers) => {
    if (_.isString(answers.baseUrl)) {
        testplaneConfig.baseUrl = answers.baseUrl;
    }

    if (_.isString(answers.gridUrl)) {
        testplaneConfig.gridUrl = answers.gridUrl;
    }

    if (answers.addChromePhone) {
        const browserId = "chrome-phone";
        const version = await inquirerPrompt<string>({
            type: "input",
            message: "chrome-phone: Enter android chrome-phone version (ex: phone-67.1):",
        });
        _.mergeWith(
            testplaneConfig,
            {
                sets: {
                    "touch-phone": {
                        browsers: [browserId],
                        files: [`${defaultTestplaneTestsDir}/**/*.testplane.(t|j)s`],
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

    return testplaneConfig;
};

export const printSuccessMessage = (configNotes: ConfigNote[]): void => {
    const successMessage = `
Inside that directory, you can run:

    ${Colors.fillTeal("npx testplane")}
      Runs testplane tests

    ${Colors.fillTeal("npx testplane gui")}
      Launches testplane's gui
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
describe("test examples", () => {
    it("docs search test", async ({browser}) => {
        await browser.openAndWait("https://testplane.io/");

        // Find by tag name
        const navBar = await browser.$("nav");

        // Find by aria-label
        await navBar.$("aria/Search").click();

        // Find by placeholder
        const fileSearchInput = await browser.findByPlaceholderText("Search docs");
        await fileSearchInput.waitForDisplayed();
        await fileSearchInput.setValue("config");

        // Find by id
        const fileSearchResults = await browser.$("#docsearch-list");

        // Find by role
        const fileSearchResultsItems = await fileSearchResults.findAllByRole("option");

        await expect(fileSearchResultsItems.length).toBeGreaterThan(1);
    });
});
`;

    await fsUtils.writeTest(dirPath, `example.testplane.${ext}`, testExample);
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

export const defineVariable = (config: TestplaneConfig, { name, value, isExpr }: VariableOpts): TestplaneConfig => {
    const quote = _.get(config, ["__template", "quote"], "'");

    return _.set(config, ["__variables", name], isExpr ? value : asString(value, quote));
};

export const addModule = (
    config: TestplaneConfig,
    variableName: string,
    moduleName = variableName,
): TestplaneConfig => {
    return _.set(config, ["__modules", variableName], moduleName);
};

export const asExpression = (value: string): string => `__expression: ${value}`;

export const connectTestingLibraryToTestplaneConfig = (config: TestplaneConfig): void => {
    addModule(config, "{ setupBrowser }", "@testplane/testing-library");

    if (config.__language === "js") {
        const prepareBrowserJsFunction = asExpression("browser => { setupBrowser(browser) }");

        _.set(config, "prepareBrowser", prepareBrowserJsFunction);
    } else if (config.__language === "ts") {
        addModule(config, "type { WdioBrowser }", "testplane");

        const prepareBrowserTsFunction = asExpression("(browser: WdioBrowser) => { setupBrowser(browser) }");

        _.set(config, "prepareBrowser", prepareBrowserTsFunction);
    }
};

export const extendWithTypescript = async (packageNamesToInstall: string[], appPath: string): Promise<void> => {
    packageNamesToInstall.push("typescript");

    const testplaneTsConfigPath = path.join(appPath, defaultTestplaneTestsDir, "tsconfig.json");
    const defaultTestplaneTsConfig = _.set(
        {},
        ["compilerOptions", "types"],
        ["testplane", "@testplane/testing-library"],
    );

    await fsUtils.writeJson(testplaneTsConfigPath, defaultTestplaneTsConfig);
};
