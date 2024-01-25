import inquirer, { type PromptModule } from "inquirer";
import * as utils from "./index";
import fsUtils from "../fsUtils";
import type { HermioneConfig, Language } from "../types/hermioneConfig";

jest.mock("inquirer");

jest.mock("../fsUtils");
jest.mock("./colors", () => ({
    Colors: {
        fillTeal: (str: string) => str,
        fillGreen: (str: string) => str,
        fillYellow: (str: string) => str,
    },
}));

describe("utils", () => {
    console.info = jest.fn();
    process.cwd = jest.fn().mockReturnValue("/cwd");

    describe("optsFromArgv", () => {
        it("should inform, if path was set to current directory by default", () => {
            utils.optsFromArgv({
                _: [],
                $0: "",
                lang: "ts",
            });

            expect(console.info).toBeCalledWith("Initializing project in /cwd");
        });

        it("should use current directory by default", () => {
            const result = utils.optsFromArgv({
                _: [""],
                $0: "",
                lang: "ts",
            });

            expect(result.path).toBe("/cwd");
        });

        it("should resolve directory from current directory", () => {
            const result = utils.optsFromArgv({
                _: ["some folder"],
                $0: "",
                lang: "ts",
            });

            expect(result.path).toBe("/cwd/some folder");
        });

        describe("should return noQuestions", () => {
            [true, false, undefined].forEach(state => {
                it(`if "yes" is "${state}"`, () => {
                    const result = utils.optsFromArgv({
                        _: ["some folder"],
                        $0: "",
                        lang: "ts",
                        yes: state,
                    });

                    expect(result.noQuestions).toBe(Boolean(state));
                });
            });
        });

        describe("language", () => {
            [
                { caseName: "ts, by default", passedValue: undefined, processedValue: "ts" },
                { caseName: "ts, if specified", passedValue: "ts", processedValue: "ts" },
                { caseName: "js, if specified", passedValue: "js", processedValue: "js" },
            ].forEach(({ caseName, passedValue, processedValue }) => {
                it(`should be ${caseName}`, () => {
                    const result = utils.optsFromArgv({
                        _: ["some folder"],
                        $0: "",
                        lang: passedValue as Language,
                    });

                    expect(result.language).toBe(processedValue);
                });
            });
        });
    });

    describe("packageNameFromPlugin", () => {
        describe("should trim suffix", () => {
            ["/plugin", "/hermione"].forEach(suffix => {
                it(suffix, () => {
                    const somePluginName = "html-reporter" + suffix;

                    expect(utils.packageNameFromPlugin(somePluginName)).toBe("html-reporter");
                });
            });
        });

        it("should not trim unknown suffix", () => {
            expect(utils.packageNameFromPlugin("@some/plugin/name")).toBe("@some/plugin/name");
        });
    });

    describe("askQuestion", () => {
        it("should ask question", async () => {
            inquirer.prompt = jest.fn().mockResolvedValue({ key: 42 }) as unknown as PromptModule;

            const result = await utils.askQuestion({ type: "list", choices: ["1"], default: "1" });

            expect(inquirer.prompt).toBeCalledWith({ name: "key", type: "list", choices: ["1"], default: "1" });
            expect(result).toBe(42);
        });
    });

    describe("baseGeneralPromptsHandler", () => {
        it("should set baseUrl", async () => {
            const result = await utils.baseGeneralPromptsHandler({} as HermioneConfig, { _path: "/", baseUrl: "foo" });

            expect(result).toStrictEqual({ baseUrl: "foo" });
        });

        it("should set gridUrl", async () => {
            const result = await utils.baseGeneralPromptsHandler({} as HermioneConfig, { _path: "/", gridUrl: "foo" });

            expect(result).toStrictEqual({ gridUrl: "foo" });
        });

        it("should add addChromePhone", async () => {
            inquirer.prompt = jest.fn().mockResolvedValue({ key: "phone-67.1" }) as unknown as PromptModule;

            const result = await utils.baseGeneralPromptsHandler({} as HermioneConfig, {
                _path: "/",
                addChromePhone: true,
            });

            expect(result).toStrictEqual({
                browsers: {
                    "chrome-phone": {
                        desiredCapabilities: {
                            browserName: "chrome",
                            deviceName: "android",
                            platformName: "Android",
                            version: "phone-67.1",
                        },
                    },
                },
                sets: {
                    "touch-phone": {
                        browsers: ["chrome-phone"],
                        files: ["tests/**/*.hermione.js"],
                    },
                },
            });
        });

        it("should do nothing if no answers given", async () => {
            const result = await utils.baseGeneralPromptsHandler({} as HermioneConfig, { _path: "/" });

            expect(result).toStrictEqual({});
        });
    });

    describe("writeTestExample", () => {
        it("with js", async () => {
            await utils.writeTestExample("/foo", "js");

            expect(fsUtils.writeTest).toBeCalledWith("/foo", "example.hermione.js", expect.anything());
        });

        it("with ts", async () => {
            await utils.writeTestExample("/foo", "ts");

            expect(fsUtils.writeTest).toBeCalledWith("/foo", "example.hermione.ts", expect.anything());
        });
    });

    describe("defineVariable", () => {
        it("should set string variable", () => {
            const config = {} as HermioneConfig;

            utils.defineVariable(config, { name: "foo", value: "ba'r" });

            expect(config).toStrictEqual({ __variables: { foo: "'ba\\'r'" } });
        });

        it("should set expr variable", () => {
            const config = {} as HermioneConfig;

            utils.defineVariable(config, { name: "foo", value: "bar", isExpr: true });

            expect(config).toStrictEqual({ __variables: { foo: "bar" } });
        });
    });

    it("addModule", () => {
        const config = {} as HermioneConfig;

        utils.addModule(config, "foo", "bar");

        expect(config).toStrictEqual({ __modules: { foo: "bar" } });
    });

    it("asExpression", () => {
        expect(utils.asExpression("foo")).toBe("__expression: foo");
    });
});
