import fsUtils from "./fsUtils";
import { initApp } from "./package";

jest.mock("child_process");
jest.mock("./fsUtils");
jest.mock("./utils");

describe("package", () => {
    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(jest.fn);
        jest.spyOn(process, "exit").mockImplementation(jest.fn as never);
    });

    describe("initApp", () => {
        [
            ".testplane.conf.ts",
            ".testplane.conf.js",
            ".hermione.conf.ts",
            ".hermione.conf.js",
            "testplane.config.ts",
            "testplane.config.cjs",
        ].forEach(configName => {
            it(`should throw an error, if ${configName} exists`, async () => {
                const dirPath = "/dir/path";
                jest.mocked(fsUtils.exists).mockImplementation(file =>
                    Promise.resolve([`${dirPath}/${configName}`, `${dirPath}/package.json`].includes(file)),
                );

                await initApp(dirPath, true);

                expect(console.error).toBeCalledWith(`Looks like ${dirPath} already contains "${configName}".`);
                expect(process.exit).toBeCalledWith(1);
            });
        });
    });
});
