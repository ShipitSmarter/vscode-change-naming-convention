/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';
import * as path from 'path';

import { showError, convertFromJson, convertFromYaml  } from './helpers';

type ConvertedFile = {
	fileUri: vscode.Uri
};

export enum NamingConvention {
	None = 'None',	
	Pascal = 'Pascal',
	Camel = 'Camel',
	Snake = 'Snake',
	Kebab = 'Kebab'
}

export enum FileType {
    Json = 'json',
    Yaml = 'yaml'
}

type ConvertFileContext = {
	fileUri: vscode.Uri;
	fileContent: string;
};

export class FileConverter {
	constructor() {	}

	public async convertFiles(toCase: NamingConvention, files: vscode.Uri[]): Promise<void> {
		const convertFilePromises = files.map((file) => this.transformAndConvertFile(toCase, file));
		const convertedFiles = await Promise.all(convertFilePromises);
		const filtered = convertedFiles.filter(Boolean) as ConvertedFile[];
	}

	private transformAndConvertFile = async (toCase: NamingConvention, fileUri: vscode.Uri): Promise<ConvertedFile | null> => {
		const oldFileContent = await vscode.workspace.fs.readFile(fileUri);
        const oldFileExtension = path.extname(fileUri.fsPath);
        let fileType = FileType.Yaml;

        if(oldFileExtension === '.json' || oldFileExtension === '.jsn') { fileType = FileType.Json; }

		const fileContent = FileConverter.getNewFileContent(toCase, fileType, oldFileContent.toString());

		await this.convertFile({ fileContent, fileUri });

		return { fileUri };
	};

	/**
	 * @returns a boolean signaling if file was converted or not.
	 */
	private convertFile = async (context: ConvertFileContext): Promise<void> => {
		const { fileContent, fileUri } = context;
		const newFile = Buffer.from(fileContent);

		try {
			await vscode.workspace.fs.writeFile(fileUri, newFile);
		} catch (error) {
			showError(error);
		}

		try {
		} catch (error: any) {
			showError(error);
		}
	};

	private static getNewFileContent(convertToType: NamingConvention, type: FileType, oldContent: string) {
		const converter = {
			[FileType.Json]: convertFromJson,
			[FileType.Yaml]: convertFromYaml,
		}[type];

		return converter(oldContent, convertToType);
	}
}
