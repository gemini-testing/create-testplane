import os from "os";
import path from "path";

const isCi = Boolean(process.env.CI);

// Read more about configuring Testplane at https://testplane.io/docs/v8/config/main/
export default {
    gridUrl: "local",
    baseUrl: "http://localhost",
    pageLoadTimeout: 20000,
    httpTimeout: 20000,
    testTimeout: 90000,
    resetCursor: false,
    sets: {
        desktop: {
            files: [
                "testplane-tests/**/*.testplane.(t|j)s"
            ],
            browsers: [
                "chrome",
                "firefox"
            ]
        }
    },
    browsers: {
        chrome: {
            headless: true,
            desiredCapabilities: {
                browserName: "chrome"
            }
        },
        firefox: {
            headless: true,
            desiredCapabilities: {
                browserName: "firefox"
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
} satisfies import("testplane").ConfigInput;
