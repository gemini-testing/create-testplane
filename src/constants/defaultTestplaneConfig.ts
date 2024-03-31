import type { TestplaneConfig } from "../types/testplaneConfig";

export const defaultTestplaneTestsDir = "testplane-tests";

const defaultTestplaneConfig: TestplaneConfig = {
    gridUrl: "http://localhost:4444/wd/hub",
    baseUrl: "http://localhost",

    pageLoadTimeout: 0,
    httpTimeout: 60000,
    testTimeout: 90000,
    resetCursor: false,

    sets: {
        desktop: {
            files: [`${defaultTestplaneTestsDir}/**/*.testplane.(t|j)s`],
            browsers: ["chrome"],
        },
    },

    browsers: {
        chrome: {
            automationProtocol: "devtools",
            headless: true,
            desiredCapabilities: {
                browserName: "chrome",
            },
        },
    },
};

export default defaultTestplaneConfig;
