import * as vscode from 'vscode';

export enum ConfigId {
    IgnoreRegex = 'ignoreRegex',
};

export type Configs = {
    ignoreRegex: string[]
};

const EXTENSION_CONFIG_ID = 'change-naming-convention';

export function getConfig<T = any>(configId: ConfigId): T | undefined {
    const config = vscode.workspace.getConfiguration(EXTENSION_CONFIG_ID);

    return config.get<T>(configId);
}