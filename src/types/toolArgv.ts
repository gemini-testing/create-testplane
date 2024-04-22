import { Language } from "./hermioneConfig";

export interface ToolArgv {
    $0: string;
    _: string[];
    verbose?: boolean;
    lang?: Language;
}
