import type { HermioneConfig } from "../types/hermioneConfig";

export const defaultHermioneTestsDir = "hermione-tests";

const defaultHermioneConfig: HermioneConfig = {
    gridUrl: "http://localhost:4444/wd/hub",
    baseUrl: "http://localhost",

    pageLoadTimeout: 0,
    httpTimeout: 60000,
    testTimeout: 90000,
    resetCursor: false,

    sets: {
        desktop: {
            files: [`${defaultHermioneTestsDir}/**/*.hermione.(t|j)s`],
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

export default defaultHermioneConfig;
