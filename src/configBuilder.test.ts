import _ from "lodash";
import { when } from "jest-when";
import inquirer from "inquirer";
import defaultTestplaneConfig from "./constants/defaultTestplaneConfig";
import { ConfigBuilder } from "./configBuilder";
import fsUtils from "./fsUtils";
import defaultPluginsConfig from "./pluginsConfig";
import type { Answers, GeneralPrompt, TestplaneConfig } from "./types";

jest.mock("inquirer");

jest.mock("./fsUtils");

describe("configBuilder", () => {
    let configBuilder: ConfigBuilder;

    const expectConfig = (expectedConfig: Record<string, any>): void => {
        configBuilder.write("");

        expect(fsUtils.writeTestplaneConfig).toBeCalledWith("", {
            __template: expect.anything(),
            ...expectedConfig,
        });
    };

    describe("constructor", () => {
        it("should use default config, if callback is not specified", () => {
            configBuilder = new ConfigBuilder();

            expectConfig(defaultTestplaneConfig);
        });

        it("should use returned callback value, if specified", () => {
            const cb = jest.fn();
            when(cb).calledWith(defaultTestplaneConfig, { language: "ts" }).mockReturnValue({ foo: "bar" });

            configBuilder = new ConfigBuilder(cb, { language: "ts" });

            expectConfig({ foo: "bar" });
        });
    });

    describe("handleGeneralQuestions", () => {
        beforeEach(() => {
            configBuilder = new ConfigBuilder();
        });

        describe("should do nothing if", () => {
            it("prompts are empty", () => {
                configBuilder.handleGeneralQuestions([], [jest.fn()], { path: "/", noQuestions: false });

                expectConfig(defaultTestplaneConfig);
            });

            it("handlers are empty", () => {
                configBuilder.handleGeneralQuestions([{ message: "foo", type: "input", name: "bar" }], [], {
                    path: "/",
                    noQuestions: false,
                });

                expectConfig(defaultTestplaneConfig);
            });
        });

        it("should not ask extra questions in 'noQuestions' mode", () => {
            configBuilder.handleGeneralQuestions(
                [
                    { message: "first silent question", type: "input", name: "1", default: "42" },
                    { message: "loud question", type: "input", name: "2" },
                    { message: "second silent question", type: "input", name: "3", default: "42" },
                ],
                [jest.fn()],
                { path: "/", noQuestions: true },
            );

            expect(inquirer.prompt).toBeCalledWith([{ message: "loud question", type: "input", name: "2" }]);
        });

        it("should mutate config with handlers", () => {
            const questions: GeneralPrompt[] = [{ type: "input", message: "?", name: "key" }];
            const answers = { baz: "qux" };

            const firstHandler = jest.fn();
            const secondHandler = jest.fn();

            const firstHandlerResult = { ...defaultTestplaneConfig, foo: "bar" };
            const secondHandlerResult = { ...firstHandlerResult, bar: "baz" };

            when(firstHandler).calledWith(defaultTestplaneConfig, answers).mockResolvedValue(firstHandlerResult);
            when(secondHandler).calledWith(firstHandlerResult, answers).mockResolvedValue(secondHandlerResult);

            when(inquirer.prompt).calledWith(questions).mockResolvedValue(answers);

            configBuilder.handleGeneralQuestions(questions, [firstHandler, secondHandler], {
                path: "/",
                noQuestions: false,
            });
        });
    });

    describe("configurePlugins", () => {
        beforeEach(() => {
            configBuilder = new ConfigBuilder();
        });

        it("should use default pluginsConfig, if not specified", async () => {
            const generalAnswers: Answers = { _path: "/", _language: "ts" };
            defaultPluginsConfig["html-reporter"] = jest.fn().mockImplementation((config: TestplaneConfig) => {
                _.set(config, "htmlReporterIsSet", true);
            });

            await configBuilder.configurePlugins({
                pluginNames: ["html-reporter"],
                generalAnswers,
            });

            expectConfig({ ...defaultTestplaneConfig, htmlReporterIsSet: true });
            expect(defaultPluginsConfig["html-reporter"]).toBeCalledWith(defaultTestplaneConfig, generalAnswers);
        });

        it("should use overwrited pluginsConfig, if specified", async () => {
            const cb = jest.fn();

            when(cb)
                .calledWith(defaultPluginsConfig)
                .mockReturnValue({
                    "html-reporter": (config: TestplaneConfig) => {
                        _.set(config, "foo", "bar");
                    },
                });

            await configBuilder.configurePlugins({
                pluginNames: ["html-reporter"],
                createPluginsConfig: cb,
                generalAnswers: { _path: "/", _language: "ts" },
            });

            expectConfig({ ...defaultTestplaneConfig, foo: "bar" });
        });
    });
});
