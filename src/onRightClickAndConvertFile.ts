import * as vscode from 'vscode';

import { showError } from './helpers';
import { FileConverter, NamingConvention } from './converter';

const fileConverter = new FileConverter();

export async function onRightClickAndConvertToCamel(oldUri: vscode.Uri) {
	if (!oldUri) {
		oldUri = getActiveTextEditorUri();
	}

	await fileConverter.convertFiles(NamingConvention.Camel, [oldUri]);
}

export async function onRightClickAndConvertToPascal(oldUri: vscode.Uri) {
	if (!oldUri) {
		oldUri = getActiveTextEditorUri();
	}

	await fileConverter.convertFiles(NamingConvention.Pascal, [oldUri]);
}

export async function onRightClickAndConvertToKebab(oldUri: vscode.Uri) {
	if (!oldUri) {
		oldUri = getActiveTextEditorUri();
	}

	await fileConverter.convertFiles(NamingConvention.Kebab, [oldUri]);
}

export async function onRightClickAndConvertToSnake(oldUri: vscode.Uri) {
	if (!oldUri) {
		oldUri = getActiveTextEditorUri();
	}

	await fileConverter.convertFiles(NamingConvention.Snake, [oldUri]);
}

export async function onRightClickAndConvertToConstant(oldUri: vscode.Uri) {
	if (!oldUri) {
		oldUri = getActiveTextEditorUri();
	}

	await fileConverter.convertFiles(NamingConvention.Constant, [oldUri]);
}

function getActiveTextEditorUri() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		throw new Error('Failed to get active text editor');
	}
	return editor.document.uri;
}