import * as vscode from 'vscode';

import {onRightClickAndConvertToCamel, onRightClickAndConvertToPascal} from './onRightClickAndConvertFile';

const { registerCommand } = vscode.commands;

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		registerCommand('vscode-change-naming-convention.rightClickCamel', onRightClickAndConvertToCamel),
		registerCommand('vscode-change-naming-convention.rightClickPascal', onRightClickAndConvertToPascal)
	);
}
