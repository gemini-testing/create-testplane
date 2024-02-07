import { Language } from "../../types";
import jsTemplate from "./js";
import tsTemplate from "./ts";

export type ConfigTemplate = {
    quote: "'" | '"' | "`";
    language: Language;
    fileName: string;
    getImportModule(importName: string, moduleName: string): string;
    getExportConfig(config: string): string;
};

export const getTemplate = (lang: Language): ConfigTemplate =>
    ({
        js: jsTemplate,
        ts: tsTemplate,
    }[lang]);
