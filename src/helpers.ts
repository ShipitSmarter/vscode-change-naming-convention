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
        [NamingConvention.Camel]: toCamel,
        [NamingConvention.Pascal]: toPascal,
        [NamingConvention.Snake]: toSnake,
        [NamingConvention.Kebab]: toKebab,
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

function toCamel(kIn: string): string{
    var originalConvention = detectConvention(kIn);
    if(originalConvention === NamingConvention.Pascal || originalConvention === NamingConvention.Camel)
    {
        return kIn[0].toLowerCase() + kIn.slice(1);
    }
    if(originalConvention === NamingConvention.Snake)
    {
        return kIn.split('_').map((s, i) => i > 0 ? s[0].toUpperCase() + s.slice(1) : s[0].toLowerCase() + s.slice(1)).join('');
    }
    if(originalConvention === NamingConvention.Kebab)
    {
        return kIn.split('-').map((s, i) => i > 0 ? s[0].toUpperCase() + s.slice(1) : s[0].toLowerCase() + s.slice(1)).join('');
    }
    return kIn;
}

function toPascal(kIn: string): string{
    var originalConvention = detectConvention(kIn);
    if(originalConvention === NamingConvention.Pascal || originalConvention === NamingConvention.Camel)
    {
        return kIn[0].toUpperCase() + kIn.slice(1);
    }
    if(originalConvention === NamingConvention.Snake)
    {
        return kIn.split('_').map((s, i) => s[0].toUpperCase() + s.slice(1)).join('');
    }
    if(originalConvention === NamingConvention.Kebab)
    {
        return kIn.split('_').map((s, i) => s[0].toUpperCase() + s.slice(1)).join('');
    }
    return kIn;
}

function toKebab(kIn: string): string{
    var originalConvention = detectConvention(kIn);
    if(originalConvention === NamingConvention.Pascal || originalConvention === NamingConvention.Camel)
    {
        return kIn.split(/(?=[A-Z])/).join('-').toLowerCase();
    }
    if(originalConvention === NamingConvention.Snake)
    {
        return kIn.split('_').join('-');
    }
    if(originalConvention === NamingConvention.Kebab)
    {
        return kIn;
    }
    return kIn;
}

function toSnake(kIn: string): string{
    var originalConvention = detectConvention(kIn);
    if(originalConvention === NamingConvention.Pascal || originalConvention === NamingConvention.Camel)
    {
        return kIn.split(/(?=[A-Z])/).join('_').toLowerCase();
    }
    if(originalConvention === NamingConvention.Snake)
    {
        return kIn;
    }
    if(originalConvention === NamingConvention.Kebab)
    {
        return kIn.split('-').join('_');
    }
    return kIn;
}

function detectConvention(sIn: string): NamingConvention{
    if(sIn.slice(1).includes('_')){
        return NamingConvention.Snake;
    }
    if(sIn.slice(1).includes('-')){
        return NamingConvention.Kebab;
    }
    if(sIn[0] === sIn[0].toLowerCase()){
        return NamingConvention.Camel;
    }
    if(sIn[0] === sIn[0].toUpperCase()){
        return NamingConvention.Pascal;
    }
/*  if(/^\d+$/.test(sIn[0])){
        return detectConvention(sIn.slice(1));
    } */
    return NamingConvention.None;
}