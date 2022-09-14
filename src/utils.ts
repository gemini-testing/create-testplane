import inquirer from "inquirer";
import path from "path";
import { exec } from "child_process";

import fsUtils from "./fsUtils";
import { ToolArgv } from "./types/toolArgv";
import { ToolOpts } from "./types/toolOpts";
import { DEFAULT_PM, HERMIONE_CONFIG_NAME, LOCK_FILES, PackageManager, PACKAGE_JSON } from "./constants/packageManagement";

export const optsFromArgv = (argv: ToolArgv): Partial<ToolOpts> => {
    const opts: Partial<ToolOpts> = {
        path: path.resolve(argv["$0"], argv["_"][0]),
        noQuestions: argv.default,
    };
    return opts;
};

const getDefaultPluginNames = (opts: ToolOpts): string[] => {
    return opts.pluginGroups.reduce((pluginNames: string[], currentGroup) => {
        const groupDefaultPlugins = currentGroup.plugins.filter(prompt => prompt.default);
        const groupPluginNames = groupDefaultPlugins.map(prompt => prompt.plugin);
        return pluginNames.concat(groupPluginNames);
    }, []);
};

const askPluginNames = async (opts: ToolOpts): Promise<string[]> => {
    let pluginNames: string[] = [];
    const pluginGroupsKey = "plugin-groups";
    const pluginKey = "plugin";

    const getDefaultFeatures = (opts: ToolOpts): number[] => {
        const inds: number[] = [];
        opts.pluginGroups.forEach(({ plugins }, ind) => {
            if (plugins.some(plugin => plugin.default)) {
                inds.push(ind);
            }
        });
        return inds;
    };

    const wantedFeatures = await inquirer.prompt({
        name: pluginGroupsKey,
        type: "checkbox",
        message: "Which features do you need?",
        choices: opts.pluginGroups.map((group, ind) => ({ name: group.description, value: ind })),
        default: getDefaultFeatures(opts),
    });

    for (const ind of wantedFeatures[pluginGroupsKey]) {
        const { description, plugins } = opts.pluginGroups[ind];
        const curGroupPlugins = await inquirer.prompt({
            name: pluginKey,
            type: "checkbox",
            message: `Plugins: ${description}`,
            choices: plugins.map(({ plugin, description }) => ({
                name: `${plugin}\t--\t${description}`,
                value: plugin,
            })),
            default: plugins.filter(plugin => plugin.default).map(({ plugin }) => plugin),
        });
        pluginNames = pluginNames.concat(curGroupPlugins[pluginKey]);
    }
    return pluginNames;
};

export const getPluginNames = async (opts: ToolOpts): Promise<string[]> => {
    return opts.noQuestions ? getDefaultPluginNames(opts) : await askPluginNames(opts);
};
const getPackageManager = async (dirPath: string, noQuestions: boolean): Promise<PackageManager> => {
    let packageManager: PackageManager | undefined;
    const packageManagers = Object.keys(LOCK_FILES) as PackageManager[];
    await Promise.all(
        packageManagers.map(async (pm: PackageManager) => {
            const isLockfileExist = await fsUtils.isExist(path.resolve(dirPath, LOCK_FILES[pm]));
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

    const pmKey = "pm";
    const answer = await inquirer.prompt({
        type: "list",
        name: pmKey,
        message: "Choose preferred package manager:",
        choices: Object.keys(LOCK_FILES),
        default: DEFAULT_PM,
    });

    return answer[pmKey];
};

const initNodeProject = (dirPath: string, packageManager: PackageManager): Promise<string> =>
    new Promise<string>((resolve, reject) => {
        exec(
            `${packageManager} init -y`,
            {
                cwd: dirPath,
                env: process.env,
            },
            (error, stdout, stderr) => {
                if (error) {
                    reject(stderr);
                } else {
                    resolve(stdout);
                }
            },
        );
    });

export const initApp = async (dirPath: string, noQuestions: boolean): Promise<PackageManager> => {
    const isDirectory = await fsUtils.isDirectory(dirPath);
    if (isDirectory === null) {
        await fsUtils.createDirectory(dirPath);
    } else if (isDirectory === false) {
        throw Error(`${dirPath} is not a directory`);
    }

    const isHermioneConfigExist = await fsUtils.isExist(path.resolve(dirPath, HERMIONE_CONFIG_NAME));
    if (isHermioneConfigExist) {
        throw Error(`${HERMIONE_CONFIG_NAME} already exists. Aborting.`);
    }

    const packageManager = await getPackageManager(dirPath, noQuestions);

    const isPackageJsonExist = await fsUtils.isExist(path.resolve(dirPath, PACKAGE_JSON));
    if (!isPackageJsonExist) {
        await initNodeProject(dirPath, packageManager);
    }

    return packageManager;
};
