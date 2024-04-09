import type { Config } from "testplane";
import type { ConfigTemplate } from "../utils/configTemplates";

type BrowserConfig = Config["browsers"][string];

interface BrowserUserConfig extends Partial<BrowserConfig> {
    desiredCapabilities: {
        browserName: string;
    };
}

export type Language = "ts" | "js";

export interface TestplaneConfig extends Omit<Partial<Config>, "browsers"> {
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
