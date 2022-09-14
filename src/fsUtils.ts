import fs from "fs";

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

export default { isExist, isDirectory, createDirectory };
