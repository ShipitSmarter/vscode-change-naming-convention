import * as vscode from 'vscode';
import * as YAML from 'yaml';
import { ConvertToType } from './converter';

const DEFAULT_ERROR_MESSAGE = 'Something went wrong, please check your file';

export function showError(error: any) {
	console.error(error);

	const message = error.message || DEFAULT_ERROR_MESSAGE;
	vscode.window.showErrorMessage(message);
}

export function convertFromJson(json: string, toCase: ConvertToType): string {
    try {
        const jsonContent = JSON.parse(json);

        let func = toCase === ConvertToType.Camel ? changeCaseOfKeysToCamel : changeCaseOfKeysToPascal;

        let newJson = func(jsonContent);

        var newContent = JSON.stringify(newJson, null, 4);

        return newContent;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to parse YAML. Please make sure it has a valid format and try again.');
	}
}

export function convertFromYaml(yaml: string, toCase: ConvertToType): string {	
	try {
        const yamlContent = YAML.parse(yaml, {
            merge: true,
            schema: 'core'
        });

        let func = toCase === ConvertToType.Camel ? changeCaseOfKeysToCamel : changeCaseOfKeysToPascal;

        let newYaml = func(yamlContent);

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

function changeCaseOfKeysToPascal(oIn: any): any {
    let objectKeysToPascal = function (origObj: object) {
        return Object.keys(origObj).reduce(function (newObj, key) {
            // @ts-ignore
            let val = origObj[key];
            let newVal = (typeof val === 'object') ? objectKeysToPascal(val) : val;
            if(Object.prototype.toString.call(val) !== '[object Array]'){
                // @ts-ignore
                newObj[key[0].toUpperCase() + key.slice(1)] = newVal;
            }
            else{
                // @ts-ignore
                newObj[key[0].toUpperCase() + key.slice(1)] = Object.values(newVal);
            }
            return newObj;
        }, {});
    };

    return objectKeysToPascal(oIn);
}

function changeCaseOfKeysToCamel(oIn: any): any {
    let objectKeysToCamel = function (origObj: object) {
        return Object.keys(origObj).reduce(function (newObj, key) {
            // @ts-ignore
            let val = origObj[key];
            let newVal = (typeof val === 'object') ? objectKeysToCamel(val) : val;
            if(Object.prototype.toString.call(val) !== '[object Array]'){
                // @ts-ignore
                newObj[key[0].toLowerCase() + key.slice(1)] = newVal;
            }
            else{
                // @ts-ignore
                newObj[key[0].toLowerCase() + key.slice(1)] = Object.values(newVal);
            }
            return newObj;
        }, {});
    };

    return objectKeysToCamel(oIn);
}