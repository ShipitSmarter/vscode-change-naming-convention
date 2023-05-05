import * as vscode from 'vscode';

import {onRightClickAndConvertToCamel, onRightClickAndConvertToPascal} from './onRightClickAndConvertFile';

const { registerCommand } = vscode.commands;

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		registerCommand('extension.rightClickJsonCamel', onRightClickAndConvertToCamel),
		registerCommand('extension.rightClickJsonPascal', onRightClickAndConvertToPascal),
		registerCommand('extension.rightClickYamlPascal', onRightClickAndConvertToPascal),
		registerCommand('extension.rightClickYamlCamel', onRightClickAndConvertToCamel),
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
