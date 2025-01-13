import type { TestplaneConfig } from "../types/testplaneConfig";

export const defaultTestplaneTestsDir = "testplane-tests";

const defaultTestplaneConfig: TestplaneConfig = {
    gridUrl: "local",
    baseUrl: "http://localhost",

    pageLoadTimeout: 0,
    httpTimeout: 60000,
    testTimeout: 90000,
    resetCursor: false,

    sets: {
        desktop: {
            files: [`${defaultTestplaneTestsDir}/**/*.testplane.(t|j)s`],
            browsers: ["chrome", "firefox"],
        },
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
