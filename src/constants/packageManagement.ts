export const PACKAGE_JSON = "package.json";
export const TESTPLANE_JS_CONFIG_NAME = ".testplane.conf.js";
export const TESTPLANE_TS_CONFIG_NAME = ".testplane.conf.ts";

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
