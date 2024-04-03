export const PACKAGE_JSON = "package.json";

export const CONFIG_NAMES = {
    TESTPLANE_TS: ".testplane.conf.ts",
    TESTPLANE_JS: ".testplane.conf.js",
    HERMIONE_TS: ".hermione.conf.ts", // drop after testplane@1
    HERMIONE_JS: ".hermione.conf.js", // drop after testplane@1
} as const;

export const DEFAULT_PM = "npm";

export type PackageManager = "npm" | "yarn" | "pnpm";

export const PMS: Record<PackageManager, { lock: string; init: string; install: string }> = {
    npm: {
        lock: "package-lock.json",
        init: "init -y",
        install: "install --save-dev",
    },
    yarn: {
        lock: "yarn.lock",
        init: "init -y",
        install: "add -D",
    },
    pnpm: {
        lock: "pnpm-lock.yml",
        init: "init",
        install: "add --save-dev",
    },
};

export const pluginSuffixes = ["/plugin", "/testplane", "/hermione"]; // drop hermione suffix after testplane@1
