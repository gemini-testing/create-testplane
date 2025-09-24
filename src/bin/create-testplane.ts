#!/usr/bin/env node

import { loadEsm } from "load-esm";

import launcher from "../index";
import { optsFromArgv } from "../utils";
import { ToolArgv } from "../types/toolArgv";
import { DefaultOpts, ToolOpts } from "../types/toolOpts";

async function main(): Promise<void> {
    const [{ default: yargs }, { hideBin }] = await Promise.all([
        loadEsm<typeof import("yargs")>("yargs"),
        loadEsm<typeof import("yargs/helpers")>("yargs/helpers"),
    ]);

    const argv = yargs(hideBin(process.argv))
        .usage("Usage: $0 <path>")
        .option("lang", {
            alias: "l",
            type: "string",
            default: "ts",
            description: "Language, which will be used to write Testplane tests",
            choices: ["ts", "js"],
        })
        .option("verbose", {
            alias: "v",
            type: "boolean",
            default: false,
            description: "Advanced configuration with extra questions",
        })
        .parse();

    const argvOpts = optsFromArgv(argv as ToolArgv);
    const createOpts = (defaultOpts: DefaultOpts): ToolOpts => ({ ...defaultOpts, ...argvOpts });

    await launcher.run({ createOpts });
}

main();
