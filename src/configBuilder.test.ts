import _ from "lodash";
import { when } from "jest-when";
import inquirer from "inquirer";
import defaultHermioneConfig from "./constants/defaultHermioneConfig";
import { ConfigBuilder } from "./configBuilder";
import fsUtils from "./fsUtils";
import defaultPluginsConfig from "./pluginsConfig";
import type { GeneralPrompt, HermioneConfig } from "./types";

jest.mock("inquirer");

jest.mock("./fsUtils");

describe("configBuilder", () => {
    let configBuilder: ConfigBuilder;

    const expectConfig = (expectedConfig: Record<string, any>): void => {
        configBuilder.write("");

        expect(fsUtils.writeHermioneConfig).toBeCalledWith("", expectedConfig);
    };

    describe("constructor", () => {
        it("should use default config, if callback is not specified", () => {
            configBuilder = new ConfigBuilder();

            expectConfig(defaultHermioneConfig);
        });

        it("should use returned callback value, if specified", () => {
            const cb = jest.fn();
            when(cb).calledWith(defaultHermioneConfig).mockReturnValue({ foo: "bar" });

            configBuilder = new ConfigBuilder(cb);

            expectConfig({ foo: "bar" });
        });
    });

    describe("handleGeneralQuestions", () => {
        beforeEach(() => {
            configBuilder = new ConfigBuilder();
        });

        describe("should do nothing if", () => {
            it("prompts are empty", () => {
                configBuilder.handleGeneralQuestions([], [jest.fn()], false);

                expectConfig(defaultHermioneConfig);
            });

            it("handlers are empty", () => {
                configBuilder.handleGeneralQuestions([{ message: "foo", type: "input", name: "bar" }], [], false);

                expectConfig(defaultHermioneConfig);
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
                true,
            );

            expect(inquirer.prompt).toBeCalledWith([{ message: "loud question", type: "input", name: "2" }]);
        });

        it("should mutate config with handlers", () => {
            const questions: GeneralPrompt[] = [{ type: "input", message: "?", name: "key" }];
            const answers = { baz: "qux" };

            const firstHandler = jest.fn();
            const secondHandler = jest.fn();

            const firstHandlerResult = { ...defaultHermioneConfig, foo: "bar" };
            const secondHandlerResult = { ...firstHandlerResult, bar: "baz" };

            when(firstHandler).calledWith(defaultHermioneConfig, answers).mockResolvedValue(firstHandlerResult);
            when(secondHandler).calledWith(firstHandlerResult, answers).mockResolvedValue(secondHandlerResult);

            when(inquirer.prompt).calledWith(questions).mockResolvedValue(answers);

            configBuilder.handleGeneralQuestions(questions, [firstHandler, secondHandler], false);
        });
    });

    describe("configurePlugins", () => {
        beforeEach(() => {
            configBuilder = new ConfigBuilder();
        });

        it("should use default pluginsConfig, if not specified", async () => {
            defaultPluginsConfig["html-reporter/hermione"] = jest.fn().mockImplementation((config: HermioneConfig) => {
                _.set(config, "htmlReporterIsSet", true);
            });

            await configBuilder.configurePlugins(["html-reporter/hermione"]);

            expectConfig({ ...defaultHermioneConfig, htmlReporterIsSet: true });
            expect(defaultPluginsConfig["html-reporter/hermione"]).toBeCalledWith(defaultHermioneConfig);
        });

        it("should use overwrited pluginsConfig, if specified", async () => {
            const cb = jest.fn();

            when(cb)
                .calledWith(defaultPluginsConfig)
                .mockReturnValue({
                    "html-reporter/hermione": (config: HermioneConfig) => {
                        _.set(config, "foo", "bar");
                    },
                });

            await configBuilder.configurePlugins(["html-reporter/hermione"], cb);

            expectConfig({ ...defaultHermioneConfig, foo: "bar" });
        });
    });
});
