import _ from "lodash";
import { promises as fsPromises, readFileSync } from "fs";
import fsUtils from "./fsUtils";
import defaultHermioneConfig from "./constants/defaultHermioneConfig";
import type { HermioneConfig } from "./types";
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

    describe("writeHermioneConfig", () => {
        const expectConfig = async (config: HermioneConfig, expectedConfigWritten: string): Promise<void> => {
            const ext = _.get(config, ["__template", "language"]);

            await fsUtils.writeHermioneConfig("/", config);

            expect(fsPromises.writeFile).toBeCalledWith(`/.hermione.conf.${ext}`, expectedConfigWritten);
        };

        it("js config", async () => {
            await expectConfig(
                {
                    ...defaultHermioneConfig,
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
            } as unknown as HermioneConfig;

            await expectConfig(withCommentsConfig, configs["withComments"]);
        });

        it("with expressions", async () => {
            const withExpressionsConfig = {
                ...jsTemplate,
                foo: "__expression: Boolean(100 + 500 * 1)",
                bar: 4,
                baz: "4",
                array: ["__expression: Boolean(100 + 500 * 1)"],
            } as unknown as HermioneConfig;

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
            } as unknown as HermioneConfig;

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
            } as unknown as HermioneConfig;

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
            } as unknown as HermioneConfig;

            await expectConfig(withTypescriptConfig, configs["withTypescript"]);
        });

        it("with everything", async () => {
            const withEverythingConfig = {
                ...defaultHermioneConfig,
                ...tsTemplate,
                __modules: {
                    os: "os",
                    path: "path",
                },
                __variables: {
                    isCi: "Boolean(process.env.CI)",
                },
            } as unknown as HermioneConfig;

            _.set(withEverythingConfig, ["plugins", "hermione-oauth"], {
                __comment: "some info",
                enabled: "__expression: isCi",
                token: '__expression: path.join(os.homedir(), ".config", "tokens", "token")',
            });

            await expectConfig(withEverythingConfig, configs["withEverything"]);
        });
    });
});
