import fs from "fs";
import { resolve as pathResolve } from "path";
import { HERMIONE_CONFIG_NAME } from "./constants/packageManagement";
import type { HermioneConfig } from "./types/hermioneConfig";

const createDirectory = (path: string): Promise<string | undefined> => fs.promises.mkdir(path, { recursive: true });

export const exists = (path: string): Promise<boolean> =>
    new Promise<boolean>(resolve => {
        fs.promises
            .access(path, fs.constants.F_OK)
            .then(() => resolve(true))
            .catch(() => resolve(false));
    });

export const ensureDirectory = async (path: string): Promise<string | void> => {
    const stat = await new Promise<fs.Stats | null>(resolve => {
        fs.promises
            .stat(path)
            .then(resolve)
            .catch(() => resolve(null));
    });

    if (stat === null) {
        return createDirectory(path);
    }

    if (!stat.isDirectory()) {
        throw Error(`${path} is not a directory!`);
    }
};

export const writeHermioneConfig = async (dirPath: string, hermioneConfig: HermioneConfig): Promise<void> => {
    const getObjectRepr = (obj: Record<string, unknown>): string => {
        // 1a. obj's records like "__comment": "Comment text", "__comment123": "Also comment text" are turned into "// Comment text"
        // 1b. array's strings like "__comment: Comment text" are turned into "// Comment text"
        // 2. removes double quotes from obj's keys where they are not needed
        // 3. replaces double quotes with single quotes
        // 4. unescapes and restores double quotes in comments
        return JSON.stringify(obj, null, 4)
            .replace(/([\t ]*)"__comment\d*(?:(?:: )|(?:": "))(.*)",?/g, "$1// $2")
            .replace(/^[\t ]*"[^:\n\r/-]+(?<!\\)":/gm, match => match.replace(/"/g, ""))
            .replace(/"/g, "'")
            .replace(/[\t ]*\/\/ (.*)/g, match => match.replace(/\\'/g, '"'));
    };

    const configData = `module.exports = ${getObjectRepr(hermioneConfig)}\n`;

    await ensureDirectory(dirPath);

    return fs.promises.writeFile(pathResolve(dirPath, HERMIONE_CONFIG_NAME), configData);
};

export const writeTest = async (dirPath: string, testName: string, testContent: string): Promise<void> => {
    const testDirPath = pathResolve(dirPath, "tests");
    const testPath = pathResolve(testDirPath, testName);

    try {
        await ensureDirectory(testDirPath);

        const isTestfileExist = await exists(testPath);

        if (!isTestfileExist) {
            await fs.promises.writeFile(testPath, testContent);
        }
    } catch {
        return;
    }
};

export default { exists, ensureDirectory, writeHermioneConfig, writeTest };
