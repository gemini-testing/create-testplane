interface HermioneSets {
    [set: string]: {
        files?: string[];
        browsers?: string[];
    };
}

interface HermioneBrowsers {
    [browser: string]: {
        automationProtocol?: string;
        desiredCapabilities: {
            browserName: string;
        };
    };
}

interface HermionePlugins {
    [plugin: string]: {
        enabled: boolean;
        [key: string]: unknown;
    };
}

export interface HermioneConfig extends Record<string, unknown> {
    baseUrl?: string;
    gridUrl?: string;
    sets?: HermioneSets;
    browsers: HermioneBrowsers;
    plugins?: HermionePlugins;
    [key: string]: unknown;
}
