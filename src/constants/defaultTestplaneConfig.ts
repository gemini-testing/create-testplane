import type { TestplaneConfig } from "../types/testplaneConfig";

export const defaultTestplaneTestsDir = "testplane-tests";

const defaultTestplaneConfig: TestplaneConfig = {
    gridUrl: "local",
    baseUrl: "http://localhost",

    pageLoadTimeout: 20000,
    httpTimeout: 20000,
    testTimeout: 90000,
    resetCursor: false,

    sets: {
        desktop: {
            files: [`${defaultTestplaneTestsDir}/**/*.testplane.(t|j)s`],
            browsers: ["chrome", "firefox"],
        },
    },

    windowSize: {
        width: 1920,
        height: 1080,
    },

    browsers: {
        chrome: {
            headless: true,
            desiredCapabilities: {
                browserName: "chrome",
            },
        },
        firefox: {
            headless: true,
            desiredCapabilities: {
                browserName: "firefox",
            },
        },
    },
};

export default defaultTestplaneConfig;
