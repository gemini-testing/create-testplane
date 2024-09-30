import { ConfigTemplate } from ".";
import { CONFIG_NAMES } from "../../constants/packageManagement";

export const jsTemplate: ConfigTemplate = {
    fileName: CONFIG_NAMES.TESTPLANE_NEW_JS,
    language: "js",
    quote: "'",
    getImportModule: (importName, moduleName) => `const ${importName} = require('${moduleName}');`,
    getExportConfig: config => `module.exports = ${config};\n`,
};

export default jsTemplate;
