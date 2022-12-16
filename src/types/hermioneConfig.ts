import type {BrowserConfig, Config} from "hermione";

interface BrowserConfigWithAutomation extends Partial<BrowserConfig> {
    automationProtocol?: string
}

export interface HermioneConfig extends Omit<Partial<Config>, "browsers"> {
    browsers: {
        [name: string]: BrowserConfigWithAutomation
    }
}
