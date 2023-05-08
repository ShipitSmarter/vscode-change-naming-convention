import * as vscode from 'vscode';
import * as YAML from 'yaml';
import { NamingConvention } from './converter';
import { camelCase, pascalCase, paramCase, snakeCase, constantCase } from 'change-case';

const DEFAULT_ERROR_MESSAGE = 'Something went wrong, please check your file';

export function showError(error: any) {
	console.error(error);

	const message = error.message || DEFAULT_ERROR_MESSAGE;
	vscode.window.showErrorMessage(message);
}

export function convertFromJson(json: string, toCase: NamingConvention): string {
    try {
        const jsonContent = JSON.parse(json);

        let func =  getCaseFunction(toCase);

        let newJson = changeObjectKeys(jsonContent, func);

        var newContent = JSON.stringify(newJson, null, 4);

        return newContent;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to parse YAML. Please make sure it has a valid format and try again.');
	}
}

export function convertFromYaml(yaml: string, toCase: NamingConvention): string {	
	try {
        const yamlContent = YAML.parse(yaml, {
            merge: true,
            schema: 'core'
        });

        let func =  getCaseFunction(toCase);

        let newYaml = changeObjectKeys(yamlContent, func);

        var newContent = YAML.stringify(newYaml, {
            merge: true,
            schema: 'core'
        });

        return newContent;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to parse JSON. Please make sure it has a valid format and try again.');
	}
}

function getCaseFunction(toCase: NamingConvention): (kIn: string) => string{
    const converter = {
        [NamingConvention.Camel]: camelCase,
        [NamingConvention.Pascal]: pascalCase,
        [NamingConvention.Snake]: snakeCase,
        [NamingConvention.Kebab]: paramCase,
        [NamingConvention.Constant]: constantCase,
        [NamingConvention.None]: (str: string) => str
    }[toCase];

    return converter;
}

function changeObjectKeys(oIn: object, caseChange: (kIn: string) => string): object{
    return Object.keys(oIn).reduce(function (newObj, key) {
        // @ts-ignore
        let val = oIn[key];
        let newVal = (typeof val === 'object') ? changeObjectKeys(val, caseChange) : val;
        if(Object.prototype.toString.call(val) !== '[object Array]'){
            // @ts-ignore
            newObj[caseChange(key)] = newVal;
        }
        else{
            // @ts-ignore
            newObj[caseChange(key)] = Object.values(newVal);
        }
        return newObj;
    }, {});
}