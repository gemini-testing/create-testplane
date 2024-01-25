import type { DefaultOpts } from "../types/toolOpts";
import pluginGroups from "./pluginGroups";

const defaultToolOpts: DefaultOpts = {
    pluginGroups,
    language: "ts",
};

export default defaultToolOpts;
