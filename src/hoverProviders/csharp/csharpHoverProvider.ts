import * as vscode from 'vscode'
import * as fs from 'fs/promises'

import { fixClassName } from '../../utils/utils';

import { suffixGenerator } from './suffixGenerators/suffixGenerator';
import { ConstSuffixGenerator } from './suffixGenerators/constSuffixGenerator';
import { DelegateSuffixGenerator } from './suffixGenerators/delegateSuffixGenerator';
import { EnumSuffixGenerator } from './suffixGenerators/enumSuffixGenerator';
import { EnumValueSuffixGenerator } from './suffixGenerators/enumValueSuffixGenerator';
import { MemberClassSuffixGenerator } from './suffixGenerators/memberClassSuffixGenerator';
import { MethodSuffixGenerator } from './suffixGenerators/methodSuffixGenerator';
import { PropertySuffixGenerator } from './suffixGenerators/propertySuffixGenerator';
import { SignalSuffixGenerator } from './suffixGenerators/signalSuffixGenerator';
import { StringNameSuffixGenerator } from './suffixGenerators/stringNameSuffixGenerator';
import { VirtualMethodSuffixGenerator } from './suffixGenerators/virtualMethodSuffixGenerator';

const globalScope = `globalscope`;
const regex = /^.#region Assembly GodotSharp, Version=(\d.\d)+[^]+?public.*?(class|struct|enum) (\w+)/;

export class CSharpHoverProvider implements vscode.HoverProvider {
    private suffixGenerators: suffixGenerator[];

    constructor() {
        this.suffixGenerators = [
            new DelegateSuffixGenerator(),
            new MethodSuffixGenerator(),
            new VirtualMethodSuffixGenerator(),
            new SignalSuffixGenerator(),
            new ConstSuffixGenerator(),
            new EnumSuffixGenerator(),
            new MemberClassSuffixGenerator(),
            new PropertySuffixGenerator(),
            new StringNameSuffixGenerator(),
            new EnumValueSuffixGenerator(),
        ];
    }

    async provideHover(document: vscode.TextDocument, position: vscode.Position) {
        const definitions = <vscode.Location[]>(
            await vscode.commands.executeCommand(
                'vscode.executeDefinitionProvider',
                vscode.window.activeTextEditor!.document.uri,
                position
            )
        );

        if (definitions?.length == 0) {
            return null;
        }

        const location = definitions[0];
        const sourcePath = location.uri.fsPath;
        const contentBuffer = await fs.readFile(sourcePath);
        const content = contentBuffer.toString('utf-8');

        const match = content.match(regex);
        if (!match || match.length == 0) {
            return null;
        }

        const version = match[1];
        const className = fixClassName(match[3]);
        let scopeName = match[2] === 'enum' || className === 'gd' ? globalScope : className;
        const hovered = document.getText(document.getWordRangeAtPosition(position));
        let link = initLink(version, scopeName);

        if (hovered.toLowerCase() != className) {
            const lines = content.split('\n');
            const lineNum = location.range.start.line;
            for (let i = 0; i < this.suffixGenerators.length; i++) {
                const generator = this.suffixGenerators[i];
                const suffix = generator.generate(scopeName, hovered, lines, lineNum);
                if (suffix != null) {
                    link += suffix;
                    break;
                }
            }
        } else if (scopeName === globalScope) {
            link += `#enum-globalscope-${hovered.toLowerCase()}`;
        }

        return new vscode.Hover(new vscode.MarkdownString(`[View online documentation](${link})`));
    }
}

function initLink(version: string, scopeName: string): string {
    if (scopeName === globalScope) {
        scopeName = `%40${scopeName}`;
    }
    return `https://docs.godotengine.org/en/${version}/classes/class_${scopeName}.html`;
}
