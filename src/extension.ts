import * as vscode from 'vscode';

import {onRightClickAndConvertToCamel, onRightClickAndConvertToPascal} from './onRightClickAndConvertFile';

const { registerCommand } = vscode.commands;

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		registerCommand('vscode-change-naming-convention.rightClickJsonCamel', onRightClickAndConvertToCamel),
		registerCommand('vscode-change-naming-convention.rightClickJsonPascal', onRightClickAndConvertToPascal),
		registerCommand('vscode-change-naming-convention.rightClickYamlPascal', onRightClickAndConvertToPascal),
		registerCommand('vscode-change-naming-convention.rightClickYamlCamel', onRightClickAndConvertToCamel),
	);

	let disposable = vscode.commands.registerCommand('vscode-change-naming-convention.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Change Naming Convention!');
	});

	context.subscriptions.push(disposable);

}
