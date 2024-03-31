import { ConfigTemplate } from ".";
import { TESTPLANE_TS_CONFIG_NAME } from "../../constants/packageManagement";

export const tsTemplate: ConfigTemplate = {
    fileName: TESTPLANE_TS_CONFIG_NAME,
    language: "ts",
    quote: '"',
    getImportModule: (importName, moduleName) => `import ${importName} from "${moduleName}";`,
    getExportConfig: config => `export default ${config};\n`,
};

export default tsTemplate;
