import { ConfigTemplate } from ".";
import { CONFIG_NAMES } from "../../constants/packageManagement";

export const tsTemplate: ConfigTemplate = {
    fileName: CONFIG_NAMES.TESTPLANE_NEW_TS,
    language: "ts",
    quote: '"',
    getImportModule: (importName, moduleName) => `import ${importName} from "${moduleName}";`,
    getExportConfig: config => `export default ${config} satisfies import("testplane").ConfigInput;\n`,
};

export default tsTemplate;
