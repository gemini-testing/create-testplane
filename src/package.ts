import { loadEsm } from "load-esm";
import path from "path";
import { exec } from "child_process";

import fsUtils from "./fsUtils";
import { DEFAULT_PM, CONFIG_NAMES, PMS, PACKAGE_JSON } from "./constants/packageManagement";
import { Colors } from "./utils/colors";
import { inquirerPrompt, packageNameFromPlugin } from "./utils";
import type { PackageManager } from "./constants/packageManagement";

const getPackageManager = async (dirPath: string, extraQuestions: boolean): Promise<PackageManager> => {
    let packageManager: PackageManager | undefined;
    const packageManagers = Object.keys(PMS) as PackageManager[];
    await Promise.all(
        packageManagers.map(async (pm: PackageManager) => {
            const isLockfileExist = await fsUtils.exists(path.resolve(dirPath, PMS[pm].lock));
            if (isLockfileExist) {
                packageManager = pm;
            }
        }),
    );

    if (packageManager) {
        return packageManager;
    }

    if (!extraQuestions) {
        return DEFAULT_PM;
    }

    return inquirerPrompt({
        type: "select",
        message: "Choose preferred package manager:",
        choices: Object.keys(PMS),
        default: DEFAULT_PM,
    });
};

const findExistingConfig = async (dirPath: string): Promise<typeof CONFIG_NAMES[keyof typeof CONFIG_NAMES] | null> => {
    const configExistsPromises = Object.values(CONFIG_NAMES).map(async configName => {
        const configPath = path.resolve(dirPath, configName);
        const exists = await fsUtils.exists(configPath);

        return exists ? configName : null;
    });

    const existingConfigs = await Promise.all(configExistsPromises);

    return existingConfigs.find(Boolean) || null;
};

const initNodeProject = (dirPath: string, packageManager: PackageManager): Promise<string> =>
    new Promise<string>((resolve, reject) => {
        exec(
            `${packageManager} ${PMS[packageManager].init}`,
            {
                cwd: dirPath,
                env: process.env,
            },
            (error, stdout, stderr) => (error ? reject(stderr) : resolve(stdout)),
        );
    });

interface MinimalPackageJson {
    scripts?: { [key: string]: string };
}

export const initApp = async (dirPath: string, extraQuestions: boolean): Promise<PackageManager> => {
    await fsUtils.ensureDirectory(dirPath);

    const existingConfigName = await findExistingConfig(dirPath);

    if (existingConfigName) {
        console.error(`Looks like ${dirPath} already contains "${existingConfigName}".`);
        console.error("Please remove old config or choose another directory.");
        process.exit(1);
    }

    const packageManager = await getPackageManager(dirPath, extraQuestions);

    const isPackageJsonExist = await fsUtils.exists(path.resolve(dirPath, PACKAGE_JSON));
    if (!isPackageJsonExist) {
        await initNodeProject(dirPath, packageManager);
    }

    const packageJson: MinimalPackageJson = await fsUtils.readJson(path.resolve(dirPath, PACKAGE_JSON));

    if (packageJson && (!packageJson?.scripts?.test || !isPackageJsonExist)) {
        packageJson.scripts = {
            ...(packageJson?.scripts || {}),
            test: "testplane",
            "test:gui": "testplane gui",
        };

        await fsUtils.writeJson(path.resolve(dirPath, PACKAGE_JSON), packageJson as Record<string, string>);
    }

    return packageManager;
};

export const installPackages = async (
    dirPath: string,
    packageManager: PackageManager,
    pluginsToInstall: string[],
    registry: string,
): Promise<string> => {
    const { default: ora } = await loadEsm<typeof import("ora")>("ora");
    const spinner = ora("Installing packages (this may take a while)").start();

    const pluginsPackages = pluginsToInstall.map(packageNameFromPlugin).join(" ");
    return new Promise<string>((resolve, reject) => {
        exec(
            PMS[packageManager].withRegistry(
                `${packageManager} ${PMS[packageManager].install} testplane ${pluginsPackages}`,
                registry,
            ),
            {
                cwd: dirPath,
                env: process.env,
            },
            (error, stdout, stderr) => {
                if (error) {
                    spinner.fail("An error occured during installation");
                    reject(stderr);
                } else {
                    spinner.succeed(
                        `Testplane and plugins have been installed successfully at ${Colors.fillGreen(dirPath)}`,
                    );
                    resolve(stdout);
                }
            },
        );
    });
};
