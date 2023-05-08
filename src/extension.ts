import * as vscode from 'vscode';

import {convertToCamel, convertToPascal, convertToConstant, convertToSnake, convertToKebab} from './onRightClickAndConvertFile';

const { registerCommand } = vscode.commands;

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		registerCommand('vscode-change-naming-convention.rightClickCamel', convertToCamel),
		registerCommand('vscode-change-naming-convention.rightClickPascal', convertToPascal),
		registerCommand('vscode-change-naming-convention.rightClickKebab', convertToKebab),
		registerCommand('vscode-change-naming-convention.rightClickSnake', convertToSnake),
		registerCommand('vscode-change-naming-convention.rightClickConstant', convertToConstant )
	);
}
