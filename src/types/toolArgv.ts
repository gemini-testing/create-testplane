import { Language } from "./testplaneConfig";

export interface ToolArgv {
    $0: string;
    _: string[];
    yes?: boolean;
    lang?: Language;
}
