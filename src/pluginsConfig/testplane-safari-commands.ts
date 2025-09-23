import _ from "lodash";
import { TESTPLANE_SAFARI_COMMANDS } from "../constants/plugins";
import { defaultTestplaneTestsDir } from "../constants/defaultTestplaneConfig";
import type { TestplaneConfig } from "../types/testplaneConfig";
import { inquirerPrompt } from "../utils";
import type { InquirerPrompts } from "../utils/inquirer";

type SafariCommand =
    | "url"
    | "click"
    | "screenshot"
    | "orientation"
    | "swipe"
    | "touch"
    | "dragAndDrop"
    | "deviceClickBack";

interface SafariBrowsers {
    [browser: string]: {
        commands: SafariCommand[];
    };
}

export default {
    name: TESTPLANE_SAFARI_COMMANDS,
    fn: async (config: TestplaneConfig): Promise<void> => {
        const browserId = "safari";

        type CreateInputPrompt = (message: string) => InquirerPrompts["input"];

        const createInputPrompt: CreateInputPrompt = message => ({
            type: "input",
            message: "testplane-safari-commands: " + message,
        });

        const deviceName = await inquirerPrompt(createInputPrompt("Enter device name (ex: iPhone 11):"));
        const platformVersion = await inquirerPrompt(createInputPrompt("Enter iOS version (ex: 13.3):"));
        const version = await inquirerPrompt(createInputPrompt("Enter safari version (ex: 13.0):"));

        _.mergeWith(
            config,
            {
                sets: {
                    "touch-phone": {
                        browsers: [browserId],
                        files: [`${defaultTestplaneTestsDir}/**/*.testplane.(t|j)s`],
                    },
                },
                browsers: {
                    [browserId]: {
                        sessionEnvFlags: { isW3C: false },
                        desiredCapabilities: {
                            platformName: "iOS",
                            platformVersion,
                            version,
                            deviceName,
                            browserName: "safari",
                            automationName: "XCUITest",
                        },
                    },
                },
                plugins: {
                    [TESTPLANE_SAFARI_COMMANDS]: {
                        __comment: "https://github.com/gemini-testing/testplane-safari-commands",
                        enabled: true,
                        browsers: Object.keys(config.browsers)
                            .filter(browser => browser.includes("safari"))
                            .reduce((browsers: SafariBrowsers, browser) => {
                                browsers[browser] = {
                                    commands: [
                                        "url",
                                        "click",
                                        "screenshot",
                                        "orientation",
                                        "swipe",
                                        "touch",
                                        "dragAndDrop",
                                        "deviceClickBack",
                                    ],
                                };
                                return browsers;
                            }, {}),
                    },
                },
            },
            (objValue, srcValue) => (_.isArray(objValue) ? _.uniq(objValue.concat(srcValue)) : undefined),
        );
    },
};
