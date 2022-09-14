import { ToolOpts } from "./types/toolOpts";
import { defaultToolOpts } from "./utils";

process.on("uncaughtException", err => {
    console.error(err.stack);
    process.exit(1);
});

process.on("unhandledRejection", (reason, p) => {
    console.error("Unhandled Rejection:\n  Promise: ", p, "\n  Reason: ", reason);
});

export type CreateOptsCallback = (defaultOpts: Partial<ToolOpts>) => ToolOpts;

const run = async (createOpts: CreateOptsCallback): Promise<void> => {
    createOpts(defaultToolOpts);
};

export default { run };
