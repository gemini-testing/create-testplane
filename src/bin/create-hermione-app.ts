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
    .option("yes", {
        alias: "y",
        type: "boolean",
        default: false,
        description: "Auto configuration with 0 questions",
    })
    .parse();

const argvOpts = optsFromArgv(argv as ToolArgv);
const createOpts = (defaultOpts: Partial<ToolOpts>): ToolOpts => _.defaults(argvOpts, defaultOpts) as ToolOpts;
launcher.run({ createOpts });
