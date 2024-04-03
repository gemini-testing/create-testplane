import { ConfigTemplate } from ".";
import { CONFIG_NAMES } from "../../constants/packageManagement";

export const tsTemplate: ConfigTemplate = {
    fileName: CONFIG_NAMES.TESTPLANE_TS,
    language: "ts",
    quote: '"',
    getImportModule: (importName, moduleName) => `import ${importName} from "${moduleName}";`,
    getExportConfig: config => `// @ts-ignore\nexport = ${config};\n`,
};

export default tsTemplate;
