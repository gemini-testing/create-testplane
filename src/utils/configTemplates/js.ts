import { ConfigTemplate } from ".";
import { TESTPLANE_JS_CONFIG_NAME } from "../../constants/packageManagement";

export const jsTemplate: ConfigTemplate = {
    fileName: TESTPLANE_JS_CONFIG_NAME,
    language: "js",
    quote: "'",
    getImportModule: (importName, moduleName) => `const ${importName} = require('${moduleName}');`,
    getExportConfig: config => `module.exports = ${config};\n`,
};

export default jsTemplate;
