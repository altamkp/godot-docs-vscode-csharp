import { suffixGenerator as suffixGenerator } from "./suffixGenerator";

const regex = /public.*enum\s*(\w+)/;

export class EnumSuffixGenerator implements suffixGenerator {
    generate(typeName: string, hovered: string, lines: string[], lineNum: number): string | null {
        const line = lines[lineNum];
        return regex.test(line) 
            ? `#enum-${typeName}-${hovered.replace(/Enum$/, '').toLowerCase()}`
            : null;
    }
}
