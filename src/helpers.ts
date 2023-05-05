import * as vscode from 'vscode';
import * as YAML from 'yaml';

const DEFAULT_ERROR_MESSAGE = 'Something went wrong, please check your file';

export function showError(error: any) {
	console.error(error);

	const message = error.message || DEFAULT_ERROR_MESSAGE;
	vscode.window.showErrorMessage(message);
}

export function getCamelFromJson(json: string): string {
    try {
        let regex =  '"([^"]+?)"\s*:';
        
        var newContent = json.replace(new RegExp(regex, 'g'), camelReplace);

        return newContent;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to parse YAML. Please make sure it has a valid format and try again.');
	}
}

export function getCamelFromYaml(yaml: string): string {	
	try {
        const yamlContent = YAML.parse(yaml, {
            merge: true,
            schema: 'core'
        });

        let newYaml = changeCaseOfKeysToCamel(yamlContent);

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

export function getPascalFromJson(json: string): string {	
	try {
        let regex =  '"([^"]+?)"\s*:';
        
        var newContent = json.replace(new RegExp(regex, 'g'), pascalReplace);

        return newContent;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to parse YAML. Please make sure it has a valid format and try again.');
	}
}

export function getPascalFromYaml(yaml: string): string {	
	try {
        const yamlContent = YAML.parse(yaml, {
            merge: true,
            schema: 'core'
        });

        let newYaml = changeCaseOfKeysToPascal(yamlContent);

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
            // @ts-ignore
            newObj[key[0].toUpperCase() + key.slice(1)] = newVal;
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
            // @ts-ignore
            newObj[key[0].toLowerCase() + key.slice(1)] = newVal;
            return newObj;
        }, {});
    };

    return objectKeysToCamel(oIn);
}

function camelReplace(match: string, group: string){
    group = group.replace('\n', '');
    let newText = group;
    if(group.length > 0){
        newText = group[0].toLowerCase() + group.slice(1);
    }

    match = match.replace(group, newText);

    return match;
}

function pascalReplace(match: string, group: string){
    group = group.replace('\n', '');
    let newText = group;
    if(group.length > 0){
        newText = group[0].toUpperCase() + group.slice(1);
    }

    match = match.replace(group, newText);

    return match;
}