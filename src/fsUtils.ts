import _ from "lodash";
import fs from "fs";
import path from "path";
import { defaultTestplaneTestsDir } from "./constants/defaultTestplaneConfig";
import { TESTPLANE_CONFIG_URL } from "./constants";
import type { TestplaneConfig } from "./types/testplaneConfig";

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

export const writeTestplaneConfig = async (dirPath: string, testplaneConfig: TestplaneConfig): Promise<void> => {
    const modules = testplaneConfig.__modules || {};
    const variables = testplaneConfig.__variables || {};
    const template = testplaneConfig.__template!;

    const omittedConfig = _.omit(testplaneConfig, ["__modules", "__variables", "__language", "__template"]);

    const toIndentedJson = (config: TestplaneConfig): string => JSON.stringify(config, null, 4);

    const withComments = (configStr: string): string => {
        // obj's records like "__comment": "Comment text" are turned into "// Comment text"
        // obj's records like "__comment123": "Comment text" are turned into "// Comment text"
        // array's strings like "__comment: Comment text" are turned into "// Comment text"
        return configStr.replace(/([\t ]*)"__comment\d*(?:(?:: )|(?:": "))(.*)",?/g, "$1// $2");
    };

    const withReplacedQuotes = (configStr: string): string => {
        // removes double quotes from obj's keys where they are not needed
        const withoutExtraQuotesConfigStr = configStr.replace(/^[\t ]*"[^:\n\r/-]+(?<!\\)":/gm, match =>
            match.replace(/"/g, ""),
        );

        if (template.language === "ts") {
            return withoutExtraQuotesConfigStr;
        }

        // replaces double quotes with single quotes
        // unescapes and restores double quotes in comments
        return withoutExtraQuotesConfigStr
            .replace(/"/g, "'")
            .replace(/[\t ]*\/\/ (.*)/g, match => match.replace(/\\'/g, '"'));
    };

    const withExpressions = (configStr: string): string => {
        const quote = template.quote;
        const expressionRegExp = new RegExp(`${quote}__expression: (.*)${quote}(,?)$`, "gm");

        const repairQuotes = (match: string): string => match.replace(/\\"/g, '"');
        const repairSlash = (match: string): string => match.replace(/\\\\/g, "\\");

        const repairedConfig = configStr
            .replace(expressionRegExp, repairQuotes) // unescapes and restores double quotes in expressions
            .replace(expressionRegExp, repairSlash); // restores '\\' in expressions

        // strings like '__expression: <expression>' are turned into <expression>
        return repairedConfig.replace(expressionRegExp, "$1$2");
    };

    const getObjectRepr = _.flow([toIndentedJson, withComments, withReplacedQuotes, withExpressions]);

    /**
     * Order:
     * - External imports
     * - Local imports
     * - External type imports
     * - Local type imports
     */
    const importsComparator = (a: string, b: string): number => {
        if (!modules[a]) {
            return 1;
        }

        if (!modules[b]) {
            return -1;
        }

        const isAType = a.startsWith("type ");
        const isBType = b.startsWith("type ");

        if (isAType !== isBType) {
            return isAType ? 1 : -1;
        }

        const isALocal = modules[a].startsWith(".");
        const isBLocal = modules[b].startsWith(".");

        if (isALocal !== isBLocal) {
            return isALocal ? 1 : -1;
        }

        return modules[a].localeCompare(modules[b]);
    };

    const configImports = Object.keys(modules)
        .sort(importsComparator)
        .map(importName => template.getImportModule(importName, modules[importName]))
        .join("\n");

    const configVariables = Object.keys(variables)
        .map(variable => `const ${variable} = ${variables[variable]};`)
        .join("\n");

    const rawConfigBody = template.getExportConfig(getObjectRepr(omittedConfig));
    const configBody = `// Read more about configuring Testplane at ${TESTPLANE_CONFIG_URL}\n${rawConfigBody}`;

    const configContents = [configImports, configVariables, configBody].filter(Boolean).join("\n\n");
    const configFileName = template.fileName;
    const configPath = path.resolve(dirPath, configFileName);

    await ensureDirectory(dirPath);

    return fs.promises.writeFile(configPath, configContents);
};

export const writeTest = async (dirPath: string, testName: string, testContent: string): Promise<void> => {
    const testDirPath = path.resolve(dirPath, defaultTestplaneTestsDir);
    const testPath = path.resolve(testDirPath, testName);

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

export const writeJson = async (filePath: string, obj: Record<string, unknown>): Promise<void> => {
    await ensureDirectory(path.dirname(filePath));

    return fs.promises.writeFile(filePath, JSON.stringify(obj, null, 4) + "\n");
};

export const readJson = async (filePath: string): Promise<Record<string, unknown>> => {
    return new Promise(resolve => {
        fs.readFile(filePath, "utf8", (_, data: string) => resolve(JSON.parse(data)));
    });
};

export default { exists, ensureDirectory, writeTestplaneConfig, writeTest, writeJson, readJson };
