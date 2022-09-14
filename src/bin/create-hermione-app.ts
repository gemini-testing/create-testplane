#!/usr/bin/env node

import yargs from "yargs";
import _ from "lodash";
import { hideBin } from "yargs/helpers";

import launcher from "../index";
import { optsFromArgv } from "../utils";
import { ToolArgv } from "../types/toolArgv";
import { ToolOpts } from "../types/toolOpts";

const argv = yargs(hideBin(process.argv))
    .usage("Usage: $0 <path>")
    .option("default", {
        alias: "d",
        type: "boolean",
        default: false,
        description: "Auto configuration with 0 questions",
    })
    .demandCommand(1, "Please provide project path")
    .parse();

const argvOpts = optsFromArgv(argv as ToolArgv);
launcher.run(defaultOpts => _.defaults(argvOpts, defaultOpts) as ToolOpts);
