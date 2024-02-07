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
        description: "Language, which will be used to write hermione tests",
        choices: ["ts", "js"],
    })
    .option("yes", {
        alias: "y",
        type: "boolean",
        default: false,
        description: "Auto configuration with 0 questions",
    })
    .parse();

const argvOpts = optsFromArgv(argv as ToolArgv);
const createOpts = (defaultOpts: DefaultOpts): ToolOpts => Object.assign(argvOpts, defaultOpts);
launcher.run({ createOpts });
