import * as vscode from 'vscode';

import { showError } from './helpers';
import { FileConverter, NamingConvention } from './converter';

const camelCaseFileConverter = new FileConverter(NamingConvention.Camel);
const pascalCaseFileConverter = new FileConverter(NamingConvention.Pascal);

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

function getActiveTextEditorUri() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		throw new Error('Failed to get active text editor');
	}
	return editor.document.uri;
}