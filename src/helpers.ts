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
        let regex =  '\s*-?\s?([^:]+?)\s*:';
        
        var newContent = yaml.replace(new RegExp(regex, 'g'), camelReplace);

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
        let regex =  '\s*-?\s?([^:]+?)\s*:';
        
        var newContent = yaml.replace(new RegExp(regex, 'g'), pascalReplace);

        return newContent;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to parse JSON. Please make sure it has a valid format and try again.');
	}
}

function camelReplace(match: string){
    if(match.length > 0){
        match = match[0].toLowerCase() + match.slice(1);
    }
    return match;
}

function pascalReplace(match: string){
    if(match.length > 0){
        match = match[0].toUpperCase() + match.slice(1);
    }
    return match;
}