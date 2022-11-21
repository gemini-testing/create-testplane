export const PACKAGE_JSON = "package.json";
export const HERMIONE_CONFIG_NAME = ".hermione.conf.js";

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
        lock: "pnp-lock.yml",
        init: "init",
        install: "add --save-dev",
    },
};

export const pluginSuffixes = ["/plugin", "/hermione"];
