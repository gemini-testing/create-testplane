#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import launcher from "../index";
import { optsFromArgv } from "../utils";
import { ToolArgv } from "../types/toolArgv";
import { DefaultOpts, ToolOpts } from "../types/toolOpts";

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
launcher.run({ createOpts });
