import os from "os";
import path from "path";

const isCi = Boolean(process.env.CI);

export default {
    gridUrl: "http://localhost:4444/wd/hub",
    baseUrl: "http://localhost",
    pageLoadTimeout: 0,
    httpTimeout: 60000,
    testTimeout: 90000,
    resetCursor: false,
    sets: {
        desktop: {
            files: [
                "testplane-tests/**/*.testplane.(t|j)s"
            ],
            browsers: [
                "chrome"
            ]
        }
    },
    browsers: {
        chrome: {
            automationProtocol: "devtools",
            headless: true,
            desiredCapabilities: {
                browserName: "chrome"
            }
        }
    },
    plugins: {
        "@testplane/oauth": {
            // some info
            enabled: isCi,
            token: path.join(os.homedir(), ".config", "tokens", "token")
        }
    }
};
