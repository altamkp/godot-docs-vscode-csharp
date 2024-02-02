import { suffixGenerator as suffixGenerator } from "./suffixGenerator";

const regex = /public.*class\s+(\w+)Name/;

export class MemberClassSuffixGenerator implements suffixGenerator {
    generate(typeName: string, hovered: string, lines: string[], lineNum: number): string | null {
        const line = lines[lineNum];
        if (!regex.test(line)) {
            return null;
        }
        const match = line.match(regex)!;
        const title = match[1];
        return title === 'Property' ? '#properties'
            : title === 'Method' ? '#methods'
                : '#signals';
    }
}
