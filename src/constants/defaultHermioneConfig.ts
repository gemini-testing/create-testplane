import type { HermioneConfig } from "../types/hermioneConfig";

const defaultHermioneConfig: HermioneConfig = {
    gridUrl: "http://localhost:4444/wd/hub",
    baseUrl: "http://localhost",

    pageLoadTimeout: 0,
    httpTimeout: 60000,
    testTimeout: 90000,
    resetCursor: false,

    sets: {
        desktop: {
            files: ["tests/**/*.hermione.js"],
            browsers: ["chrome"],
        },
    },

    browsers: {
        chrome: {
            automationProtocol: "devtools",
            desiredCapabilities: {
                browserName: "chrome",
            },
        },
    },
};

export default defaultHermioneConfig;
