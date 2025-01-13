import type { GeneralPrompt } from "../types/toolOpts";

const baseGeneralPrompts: GeneralPrompt[] = [
    {
        type: "input",
        name: "baseUrl",
        message: "BaseUrl",
        default: "http://localhost",
    },
    {
        type: "input",
        name: "gridUrl",
        message: "GridUrl",
        default: "local",
    },
    {
        type: "confirm",
        name: "addChromePhone",
        message: "Add Android chrome phone?",
        default: false,
    },
];

export default baseGeneralPrompts;
