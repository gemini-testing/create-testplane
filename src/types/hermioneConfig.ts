import type {BrowserConfig, Config} from "hermione";

interface BrowserUserConfig extends Partial<BrowserConfig> {
    desiredCapabilities: {
        browserName: string
    }
}

export interface HermioneConfig extends Omit<Partial<Config>, "browsers"> {
    browsers: {
        [name: string]: BrowserUserConfig
    }
}
