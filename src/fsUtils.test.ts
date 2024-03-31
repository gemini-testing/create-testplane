import _ from "lodash";
import { promises as fsPromises, readFileSync } from "fs";
import fsUtils from "./fsUtils";
import defaultTestplaneConfig from "./constants/defaultTestplaneConfig";
import type { TestplaneConfig } from "./types";
import { getTemplate } from "./utils/configTemplates";

const readFixtureConfigSync = (configName: string): string =>
    readFileSync(`./__fixtures/config/${configName}.js`, { encoding: "utf-8" });

const configs = {
    jsConfig: readFixtureConfigSync("jsConfig"),
    withComments: readFixtureConfigSync("withComments"),
    withExpressions: readFixtureConfigSync("withExpressions"),
    withModules: readFixtureConfigSync("withModules"),
    withVariables: readFixtureConfigSync("withVariables"),
    withTypescript: readFixtureConfigSync("withTypescript"),
    withEverything: readFixtureConfigSync("withEverything"),
};

jest.mock("fs", () => ({
    readFileSync: jest.requireActual("fs").readFileSync,
    promises: {
        access: jest.fn().mockResolvedValue(true),
        stat: jest.fn().mockResolvedValue({ isDirectory: jest.fn().mockReturnValue(true) }),
        writeFile: jest.fn().mockResolvedValue(true),
    },
}));

describe("fsUtils", () => {
    const jsTemplate = { __template: getTemplate("js") };
    const tsTemplate = { __template: getTemplate("ts") };

    describe("writeTestplaneConfig", () => {
        const expectConfig = async (config: TestplaneConfig, expectedConfigWritten: string): Promise<void> => {
            const ext = _.get(config, ["__template", "language"]);

            await fsUtils.writeTestplaneConfig("/", config);

            expect(fsPromises.writeFile).toBeCalledWith(`/.testplane.conf.${ext}`, expectedConfigWritten);
        };

        it("js config", async () => {
            await expectConfig(
                {
                    ...defaultTestplaneConfig,
                    ...jsTemplate,
                },
                configs["jsConfig"],
            );
        });

        it("with comments", async () => {
            const withCommentsConfig = {
                ...jsTemplate,
                __comment: "some comment",
                __comment4: "other comment",
                array: ["__comment: array comment", "some stirng", "__comment: another comment"],
            } as unknown as TestplaneConfig;

            await expectConfig(withCommentsConfig, configs["withComments"]);
        });

        it("with expressions", async () => {
            const withExpressionsConfig = {
                ...jsTemplate,
                foo: "__expression: Boolean(100 + 500 * 1)",
                bar: 4,
                baz: "4",
                array: ["__expression: Boolean(100 + 500 * 1)"],
                specials: "__expression: /\n\t\r/g",
                extraSlash: "__expression: /\\, \\, \\\\/g",
            } as unknown as TestplaneConfig;

            await expectConfig(withExpressionsConfig, configs["withExpressions"]);
        });

        it("with modules", async () => {
            const withModulesConfig = {
                ...jsTemplate,
                __modules: {
                    os: "os",
                    path: "path",
                    fs: "fs",
                },
            } as unknown as TestplaneConfig;

            await expectConfig(withModulesConfig, configs["withModules"]);
        });

        it("with variables", async () => {
            const withVariablesConfig = {
                ...jsTemplate,
                __variables: {
                    isCi: "process.env.CI",
                    numbersSum: "100 + 500",
                    somePath: 'path.resolve(os.homedir(), ".some-folder")',
                },
            } as unknown as TestplaneConfig;

            await expectConfig(withVariablesConfig, configs["withVariables"]);
        });

        it("with typescript", async () => {
            const withTypescriptConfig = {
                ...tsTemplate,
                __modules: {
                    os: "os",
                    path: "path",
                    fs: "fs",
                },
            } as unknown as TestplaneConfig;

            await expectConfig(withTypescriptConfig, configs["withTypescript"]);
        });

        it("with everything", async () => {
            const withEverythingConfig = {
                ...defaultTestplaneConfig,
                ...tsTemplate,
                __modules: {
                    os: "os",
                    path: "path",
                },
                __variables: {
                    isCi: "Boolean(process.env.CI)",
                },
            } as unknown as TestplaneConfig;

            _.set(withEverythingConfig, ["plugins", "@testplane/oauth"], {
                __comment: "some info",
                enabled: "__expression: isCi",
                token: '__expression: path.join(os.homedir(), ".config", "tokens", "token")',
            });

            await expectConfig(withEverythingConfig, configs["withEverything"]);
        });
    });
});
