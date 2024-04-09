import ora from "ora";
import path from "path";
import { exec } from "child_process";

import fsUtils from "./fsUtils";
import { DEFAULT_PM, CONFIG_NAMES, PMS, PACKAGE_JSON } from "./constants/packageManagement";
import { Colors } from "./utils/colors";
import { askQuestion, packageNameFromPlugin } from "./utils";
import type { PackageManager } from "./constants/packageManagement";

const getPackageManager = async (dirPath: string, noQuestions: boolean): Promise<PackageManager> => {
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

    if (noQuestions) {
        return DEFAULT_PM;
    }

    return askQuestion<PackageManager>({
        type: "list",
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

export const initApp = async (dirPath: string, noQuestions: boolean): Promise<PackageManager> => {
    await fsUtils.ensureDirectory(dirPath);

    const existingConfigName = await findExistingConfig(dirPath);

    if (existingConfigName) {
        console.error(`Looks like ${dirPath} already contains "${existingConfigName}".`);
        console.error("Please remove old config or choose another directory.");
        process.exit(1);
    }

    const packageManager = await getPackageManager(dirPath, noQuestions);

    const isPackageJsonExist = await fsUtils.exists(path.resolve(dirPath, PACKAGE_JSON));
    if (!isPackageJsonExist) {
        await initNodeProject(dirPath, packageManager);
    }

    return packageManager;
};

export const installPackages = async (
    dirPath: string,
    packageManager: PackageManager,
    pluginsToInstall: string[],
    registry: string,
): Promise<string> => {
    const spinner = ora("Installing packages (this may take a while)").start();

    const pluginsPackages = pluginsToInstall.map(packageNameFromPlugin).join(" ");

    return new Promise<string>((resolve, reject) => {
        exec(
            `${packageManager} ${PMS[packageManager].install} testplane ${pluginsPackages} --registry "${registry}"`,
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
