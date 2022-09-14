import { ToolOpts } from "./types/toolOpts";
import { getPluginNames, defaultToolOpts } from "./utils";

process.on("uncaughtException", err => {
    console.error(err.stack);
    process.exit(1);
});

process.on("unhandledRejection", (reason, p) => {
    console.error("Unhandled Rejection:\n  Promise: ", p, "\n  Reason: ", reason);
});

export type CreateOptsCallback = (defaultOpts: Partial<ToolOpts>) => ToolOpts;

const run = async (createOpts: CreateOptsCallback): Promise<void> => {
    const opts = createOpts(defaultToolOpts);
    const pluginsToInstall = await getPluginNames(opts);
    console.log('Plugins to install: ', pluginsToInstall);
};

export default { run };
