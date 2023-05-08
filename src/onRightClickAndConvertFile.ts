import * as vscode from 'vscode';

import { FileConverter, NamingConvention } from './converter';

const fileConverter = new FileConverter();

export async function convertToCamel(oldUri: vscode.Uri) {
	if (!oldUri) {
		oldUri = getActiveTextEditorUri();
	}

	await fileConverter.convertFiles(NamingConvention.Camel, [oldUri]);
}

export async function convertToPascal(oldUri: vscode.Uri) {
	if (!oldUri) {
		oldUri = getActiveTextEditorUri();
	}

	await fileConverter.convertFiles(NamingConvention.Pascal, [oldUri]);
}

export async function convertToKebab(oldUri: vscode.Uri) {
	if (!oldUri) {
		oldUri = getActiveTextEditorUri();
	}

	await fileConverter.convertFiles(NamingConvention.Kebab, [oldUri]);
}

export async function convertToSnake(oldUri: vscode.Uri) {
	if (!oldUri) {
		oldUri = getActiveTextEditorUri();
	}

	await fileConverter.convertFiles(NamingConvention.Snake, [oldUri]);
}

export async function convertToConstant(oldUri: vscode.Uri) {
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