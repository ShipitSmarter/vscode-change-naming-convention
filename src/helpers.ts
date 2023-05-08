import * as vscode from 'vscode';
import * as YAML from 'yaml';
import { NamingConvention } from './converter';

const DEFAULT_ERROR_MESSAGE = 'Something went wrong, please check your file';

export function showError(error: any) {
	console.error(error);

	const message = error.message || DEFAULT_ERROR_MESSAGE;
	vscode.window.showErrorMessage(message);
}

export function convertFromJson(json: string, toCase: NamingConvention): string {
    try {
        const jsonContent = JSON.parse(json);

        let func = toCase === NamingConvention.Camel ? toCamel : toPascal;

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

        let func = toCase === NamingConvention.Camel ? toCamel : toPascal;

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

function toCamel(kIn: string): string{
    return kIn[0].toLowerCase() + kIn.slice(1);
}

function toPascal(kIn: string): string{
    return kIn[0].toUpperCase() + kIn.slice(1);
}

function detectCase(oIn: object): NamingConvention{
    let camelCase = true;
    let pascalCase = true;
    Object.keys(oIn).forEach(function(key) {
        if(key[0] !== key[0].toLowerCase()){
            camelCase = false;
        }
        if(key[0] !== key[0].toUpperCase()){
            pascalCase = false;
        }
    });
    if(camelCase){
        return NamingConvention.Camel;
    }
    if(pascalCase){
        return NamingConvention.Pascal;
    }
    return NamingConvention.None;
}