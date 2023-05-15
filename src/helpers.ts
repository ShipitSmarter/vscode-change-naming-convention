import * as vscode from 'vscode';
import * as YAML from 'yaml';
import { NamingConvention } from './converter';
import { camelCase, pascalCase, paramCase, snakeCase, constantCase } from 'change-case';
import { ConfigId, Configs, getConfig } from './config';

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

        let newJson = changeObjectKeys(jsonContent, buildIgnoreRegexes(), func);

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

        let newYaml = changeObjectKeys(yamlContent, buildIgnoreRegexes(), func);

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

function buildIgnoreRegexes(): RegExp[]{
    const ignoreRegex = getConfig<Configs['ignoreRegex']>(ConfigId.IgnoreRegex);
    if(ignoreRegex === undefined) {
        return [];
    };
    return ignoreRegex?.map(regex => new RegExp(`^${regex}$`));
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

function changeObjectKeys(oIn: object, ignoreRegex: RegExp[], caseChange: (kIn: string) => string): object{
    return Object.keys(oIn).reduce(function (newObj, key) {
        // @ts-ignore
        let val = oIn[key];
        let newVal = (typeof val === 'object') ? changeObjectKeys(val, ignoreRegex, caseChange) : val;

        let newKey = caseChange(key);

        ignoreRegex.forEach(regex => {
            if(regex.test(key)){
                newKey = key;
            }
        });       

        if(Object.prototype.toString.call(val) !== '[object Array]'){
            // @ts-ignore
            newObj[newKey] = newVal;
        }
        else{
            // @ts-ignore
            newObj[newKey] = Object.values(newVal);
        }
        return newObj;
    }, {});
}