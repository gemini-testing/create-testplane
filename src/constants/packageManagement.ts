export const PACKAGE_JSON = "package.json";
export const HERMIONE_CONFIG_NAME = ".hermione.conf.js";

export const DEFAULT_PM = "npm";

export type PackageManager = "npm" | "yarn" | "pnpm";

export const LOCK_FILES: Record<PackageManager, string> = {
    npm: "package-lock.json",
    yarn: "yarn.lock",
    pnpm: "pnp-lock.yml",
};
