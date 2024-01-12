import { Colors } from "./colors";

describe("utils/colors", () => {
    it("fillTeal", () => {
        expect(Colors.fillTeal("some text")).toBe("\u001B[36msome text\u001B[0m");
    });

    it("fillGreen", () => {
        expect(Colors.fillGreen("some text")).toBe("\u001B[32msome text\u001B[0m");
    });

    it("fillYellow", () => {
        expect(Colors.fillYellow("some text")).toBe("\u001B[33msome text\u001B[0m");
    });
});
