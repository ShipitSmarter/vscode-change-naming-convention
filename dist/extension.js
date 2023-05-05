/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.convertFile = exports.onRightClickAndConvertToPascal = exports.onRightClickAndConvertToCamel = void 0;
const vscode = __webpack_require__(1);
const helpers_1 = __webpack_require__(3);
const converter_1 = __webpack_require__(4);
const camelCaseFileConverter = new converter_1.FileConverter(converter_1.ConvertToType.Camel);
const pascalCaseFileConverter = new converter_1.FileConverter(converter_1.ConvertToType.Pascal);
async function onRightClickAndConvertToCamel(oldUri) {
    if (!oldUri) {
        oldUri = getActiveTextEditorUri();
    }
    await camelCaseFileConverter.convertFiles([oldUri]);
}
exports.onRightClickAndConvertToCamel = onRightClickAndConvertToCamel;
async function onRightClickAndConvertToPascal(oldUri) {
    if (!oldUri) {
        oldUri = getActiveTextEditorUri();
    }
    await pascalCaseFileConverter.convertFiles([oldUri]);
}
exports.onRightClickAndConvertToPascal = onRightClickAndConvertToPascal;
async function convertFile(oldUri, newUri, newText) {
    try {
        await vscode.workspace.fs.writeFile(oldUri, Buffer.from(newText));
        await vscode.workspace.fs.rename(oldUri, newUri);
    }
    catch (error) {
        (0, helpers_1.showError)(error);
    }
}
exports.convertFile = convertFile;
function getActiveTextEditorUri() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        throw new Error('Failed to get active text editor');
    }
    return editor.document.uri;
}


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getPascalFromYaml = exports.getPascalFromJson = exports.getCamelFromYaml = exports.getCamelFromJson = exports.showError = void 0;
const vscode = __webpack_require__(1);
const DEFAULT_ERROR_MESSAGE = 'Something went wrong, please check your file';
function showError(error) {
    console.error(error);
    const message = error.message || DEFAULT_ERROR_MESSAGE;
    vscode.window.showErrorMessage(message);
}
exports.showError = showError;
function getCamelFromJson(json) {
    try {
        let regex = '"([^"]+?)"\s*:';
        var newContent = json.replace(new RegExp(regex, 'g'), camelReplace);
        return newContent;
    }
    catch (error) {
        console.error(error);
        throw new Error('Failed to parse YAML. Please make sure it has a valid format and try again.');
    }
}
exports.getCamelFromJson = getCamelFromJson;
function getCamelFromYaml(yaml) {
    try {
        let regex = '\s*-?\s?([^:]+?)\s*:';
        var newContent = yaml.replace(new RegExp(regex, 'g'), camelReplace);
        return newContent;
    }
    catch (error) {
        console.error(error);
        throw new Error('Failed to parse JSON. Please make sure it has a valid format and try again.');
    }
}
exports.getCamelFromYaml = getCamelFromYaml;
function getPascalFromJson(json) {
    try {
        let regex = '"([^"]+?)"\s*:';
        var newContent = json.replace(new RegExp(regex, 'g'), pascalReplace);
        return newContent;
    }
    catch (error) {
        console.error(error);
        throw new Error('Failed to parse YAML. Please make sure it has a valid format and try again.');
    }
}
exports.getPascalFromJson = getPascalFromJson;
function getPascalFromYaml(yaml) {
    try {
        let regex = '\s*-?\s?([^:]+?)\s*:';
        var newContent = yaml.replace(new RegExp(regex, 'g'), pascalReplace);
        return newContent;
    }
    catch (error) {
        console.error(error);
        throw new Error('Failed to parse JSON. Please make sure it has a valid format and try again.');
    }
}
exports.getPascalFromYaml = getPascalFromYaml;
function camelReplace(match) {
    if (match.length > 0) {
        match = match[0].toLowerCase() + match.slice(1);
    }
    return match;
}
function pascalReplace(match) {
    if (match.length > 0) {
        match = match[0].toUpperCase() + match.slice(1);
    }
    return match;
}


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileConverter = exports.FileType = exports.ConvertToType = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const vscode = __webpack_require__(1);
const path = __webpack_require__(5);
const helpers_1 = __webpack_require__(3);
var ConvertToType;
(function (ConvertToType) {
    ConvertToType["Pascal"] = "Pascal";
    ConvertToType["Camel"] = "Camel";
})(ConvertToType = exports.ConvertToType || (exports.ConvertToType = {}));
var FileType;
(function (FileType) {
    FileType["Json"] = "json";
    FileType["Yaml"] = "yaml";
})(FileType = exports.FileType || (exports.FileType = {}));
class FileConverter {
    constructor(convertToType) {
        this.transformAndConvertFile = async (fileUri) => {
            const oldFileContent = await vscode.workspace.fs.readFile(fileUri);
            const oldFileExtension = path.extname(fileUri.fsPath);
            let fileType = FileType.Yaml;
            if (oldFileExtension === '.json' || oldFileExtension === '.jsn') {
                fileType = FileType.Json;
            }
            const fileContent = FileConverter.getNewFileContent(this.convertToType, fileType, oldFileContent.toString());
            await this.convertFile({ fileContent, fileUri });
            return { fileUri };
        };
        /**
         * @returns a boolean signaling if file was converted or not.
         */
        this.convertFile = async (context) => {
            const { fileContent, fileUri } = context;
            const newFile = Buffer.from(fileContent);
            try {
                await vscode.workspace.fs.writeFile(fileUri, newFile);
            }
            catch (error) {
                (0, helpers_1.showError)(error);
            }
            try {
            }
            catch (error) {
                (0, helpers_1.showError)(error);
            }
        };
        this.convertToType = convertToType;
    }
    async convertFiles(files) {
        const convertFilePromises = files.map((file) => this.transformAndConvertFile(file));
        const convertedFiles = await Promise.all(convertFilePromises);
        const filtered = convertedFiles.filter(Boolean);
    }
    static getNewFileContent(convertToType, type, oldContent) {
        const converter = {
            [FileType.Json]: { [ConvertToType.Camel]: helpers_1.getCamelFromJson, [ConvertToType.Pascal]: helpers_1.getPascalFromJson },
            [FileType.Yaml]: { [ConvertToType.Camel]: helpers_1.getCamelFromYaml, [ConvertToType.Pascal]: helpers_1.getPascalFromYaml },
        }[type][convertToType];
        return converter(oldContent);
    }
}
exports.FileConverter = FileConverter;


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("path");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
const vscode = __webpack_require__(1);
const onRightClickAndConvertFile_1 = __webpack_require__(2);
const { registerCommand } = vscode.commands;
function activate(context) {
    context.subscriptions.push(registerCommand('extension.rightClickJsonCamel', onRightClickAndConvertFile_1.onRightClickAndConvertToCamel), registerCommand('extension.rightClickJsonPascal', onRightClickAndConvertFile_1.onRightClickAndConvertToPascal), registerCommand('extension.rightClickYamlPascal', onRightClickAndConvertFile_1.onRightClickAndConvertToPascal), registerCommand('extension.rightClickYamlCamel', onRightClickAndConvertFile_1.onRightClickAndConvertToCamel));
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map