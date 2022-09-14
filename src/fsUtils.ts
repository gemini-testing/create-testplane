import fs from "fs";
import { HermioneConfig } from "./types/hermioneConfig";

export const isExist = (path: string): Promise<boolean> =>
    new Promise<boolean>(resolve => {
        fs.promises
            .access(path, fs.constants.F_OK)
            .then(() => resolve(true))
            .catch(() => resolve(false));
    });

/**
 * @returns null, if doesn't exist. Boolean otherwise
 */
export const isDirectory = async (path: string): Promise<boolean | null> => {
    const stat = await new Promise<fs.Stats | null>(resolve => {
        fs.promises
            .lstat(path)
            .then(resolve)
            .catch(() => resolve(null));
    });
    return stat && stat.isDirectory();
};

export const createDirectory = (path: string): Promise<string | undefined> =>
    fs.promises.mkdir(path, { recursive: true });

export const writeHermioneConfig = (path: string, hermioneConfig: HermioneConfig): Promise<void> => {
    const getObjectRepr = (obj: Record<string, unknown>): string => {
        // 1a. obj's records like "__comment": "Comment text", "__comment123": "Also comment text" are turned into "// Comment text"
        // 1b. array's strings like "__comment: Comment text" are turned into "// Comment text"
        // 2. removes double quotes from obj's keys where they are not needed
        // 3. replaces double quotes with single quotes
        // 4. unescapes and restores double quotes in comments
        return JSON.stringify(obj, null, 4)
            .replace(/([\t ]*)"__comment\d*(?:(?:: )|(?:": "))(.*)",?/g, "$1// $2")
            .replace(/^[\t ]*"[^:\n\r/-]+(?<!\\)":/gm, (match) => match.replace(/"/g, ""))
            .replace(/"/g, "'")
            .replace(/[\t ]*\/\/ (.*)/g, (match) => match.replace(/\\'/g, '"'));
    };

    const configData = `module.exports = ${getObjectRepr(hermioneConfig)}\n`;

    return fs.promises.writeFile(path, configData);
};

export default { isExist, isDirectory, createDirectory };
