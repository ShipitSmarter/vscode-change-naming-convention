import * as vscode from 'vscode';

import {onRightClickAndConvertToCamel, onRightClickAndConvertToPascal, onRightClickAndConvertToKebab, onRightClickAndConvertToSnake, onRightClickAndConvertToConstant} from './onRightClickAndConvertFile';

const { registerCommand } = vscode.commands;

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		registerCommand('vscode-change-naming-convention.rightClickCamel', onRightClickAndConvertToCamel),
		registerCommand('vscode-change-naming-convention.rightClickPascal', onRightClickAndConvertToPascal),
		registerCommand('vscode-change-naming-convention.rightClickKebab', onRightClickAndConvertToKebab),
		registerCommand('vscode-change-naming-convention.rightClickSnake', onRightClickAndConvertToSnake),
		registerCommand('vscode-change-naming-convention.rightClickConstant', onRightClickAndConvertToConstant )
	);
}
