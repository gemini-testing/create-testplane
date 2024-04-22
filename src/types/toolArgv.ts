import { Language } from "./testplaneConfig";

export interface ToolArgv {
    $0: string;
    _: string[];
    verbose?: boolean;
    lang?: Language;
}
