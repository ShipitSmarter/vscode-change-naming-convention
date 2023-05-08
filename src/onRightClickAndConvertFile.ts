import * as vscode from 'vscode';

import { showError } from './helpers';
import { FileConverter, NamingConvention } from './converter';

const camelCaseFileConverter = new FileConverter(NamingConvention.Camel);
const pascalCaseFileConverter = new FileConverter(NamingConvention.Pascal);
const kebabCaseFileConverter = new FileConverter(NamingConvention.Kebab);
const snakeCaseFileConverter = new FileConverter(NamingConvention.Snake);

export async function onRightClickAndConvertToCamel(oldUri: vscode.Uri) {
	if (!oldUri) {
		oldUri = getActiveTextEditorUri();
	}

	await camelCaseFileConverter.convertFiles([oldUri]);
}

export async function onRightClickAndConvertToPascal(oldUri: vscode.Uri) {
	if (!oldUri) {
		oldUri = getActiveTextEditorUri();
	}

	await pascalCaseFileConverter.convertFiles([oldUri]);
}

export async function onRightClickAndConvertToKebab(oldUri: vscode.Uri) {
	if (!oldUri) {
		oldUri = getActiveTextEditorUri();
	}

	await kebabCaseFileConverter.convertFiles([oldUri]);
}

export async function onRightClickAndConvertToSnake(oldUri: vscode.Uri) {
	if (!oldUri) {
		oldUri = getActiveTextEditorUri();
	}

	await snakeCaseFileConverter.convertFiles([oldUri]);
}

function getActiveTextEditorUri() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		throw new Error('Failed to get active text editor');
	}
	return editor.document.uri;
}