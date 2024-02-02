import { suffixGenerator as suffixGenerator } from "./suffixGenerator";

const enumRegex = /public.*enum\s*(\w+)/;
const valueRegex = /^\s*\w+.*,?\r$/;

export class EnumValueSuffixGenerator implements suffixGenerator {
    generate(typeName: string, hovered: string, lines: string[], lineNum: number): string | null {
        const line = lines[lineNum];
        if (!valueRegex.test(line)) {
            return null;
        }

        for (let i = lineNum - 1; i >= 0; i--) {
            const match = lines[i].match(enumRegex);
            if (match && match[1]) {
                const enumName = match[1].replace(/Enum$/, '').toLowerCase();
                return `#enum-${typeName}-${enumName}`
            }
        }
        return null;
    }
}
