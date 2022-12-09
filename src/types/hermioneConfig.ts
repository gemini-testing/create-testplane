interface HermioneSets {
    [set: string]: {
        files?: string[];
        browsers?: string[];
        ignoreFiles?: string[];
    };
}

interface HermioneBrowsers {
    [browser: string]: {
        automationProtocol?: string;
        desiredCapabilities: {
            browserName: string;
            version?: string;
            [key: string]: unknown;
        };
        [key: string]: unknown;
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
