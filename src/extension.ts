import * as vscode from 'vscode';
import { CSharpHoverProvider } from './hoverProviders/csharp/csharpHoverProvider';

export function activate() {
    vscode.languages.registerHoverProvider('csharp', new CSharpHoverProvider());
}

export function deactivate() { }
