export const PACKAGE_JSON = "package.json";

export const CONFIG_NAMES = {
    TESTPLANE_NEW_TS: "testplane.config.ts",
    TESTPLANE_NEW_CTS: "testplane.config.cts",
    TESTPLANE_NEW_JS: "testplane.config.js",
    TESTPLANE_NEW_CJS: "testplane.config.cjs",
    TESTPLANE_TS: ".testplane.conf.ts",
    TESTPLANE_JS: ".testplane.conf.js",
    HERMIONE_TS: ".hermione.conf.ts", // drop after testplane@9
    HERMIONE_JS: ".hermione.conf.js", // drop after testplane@9
} as const;

export const DEFAULT_PM = "npm";

export type PackageManager = "npm" | "yarn" | "pnpm";

export const PMS: Record<
    PackageManager,
    { lock: string; init: string; install: string; withRegistry: (command: string, registry: string) => string }
> = {
    npm: {
        lock: "package-lock.json",
        init: "init -y",
        install: "install --save-dev",
        withRegistry: (command, registry) => `${command} --registry ${registry}`,
    },
    yarn: {
        lock: "yarn.lock",
        init: "init -y",
        install: "add -D",
        withRegistry: (command, registry) =>
            `export YARN_REGISTRY=${registry} && export YARN_NPM_REGISTRY_SERVER=${registry} && ${command}`,
    },
    pnpm: {
        lock: "pnpm-lock.yml",
        init: "init",
        install: "add --save-dev",
        withRegistry: (command, registry) => `${command} --registry ${registry}`,
    },
};

export const pluginSuffixes = ["/plugin", "/testplane", "/hermione"]; // drop hermione suffix after testplane@2
