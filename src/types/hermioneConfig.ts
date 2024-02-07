import type { BrowserConfig, Config } from "hermione";
import type { ConfigTemplate } from "../utils/configTemplates";

interface BrowserUserConfig extends Partial<BrowserConfig> {
    automationProtocol?: "webdriver" | "devtools";
    desiredCapabilities: {
        browserName: string;
    };
}

export type Language = "ts" | "js";

export interface HermioneConfig extends Omit<Partial<Config>, "browsers"> {
    __language?: Language;
    __template?: ConfigTemplate;
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
