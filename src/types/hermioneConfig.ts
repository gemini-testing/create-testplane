import type { BrowserConfig, Config } from "hermione";

interface BrowserUserConfig extends Partial<BrowserConfig> {
    automationProtocol?: "webdriver" | "devtools";
    desiredCapabilities: {
        browserName: string;
    };
}

export interface HermioneConfig extends Omit<Partial<Config>, "browsers"> {
    __modules?: {
        [name: string]: string;
    };
    __variables?: {
        [name: string]: string;
    };
    browsers: {
        [name: string]: BrowserUserConfig;
    };
}
