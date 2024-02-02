import { hyphenate } from "../../../utils/utils";
import { suffixGenerator as suffixGenerator } from "./suffixGenerator";

const memberClassRegex = /public.*class\s+(\w+)Name/;
const stringNameRegex = /public.*static.*readonly.*StringName/;

export class StringNameSuffixGenerator implements suffixGenerator {
    generate(typeName: string, hovered: string, lines: string[], lineNum: number): string | null {
        const line = lines[lineNum];
        if (!stringNameRegex.test(line)) {
            return null;
        }

        for (let i = lineNum - 1; i >= 0; i--) {
            const match = lines[i].match(memberClassRegex);
            if (match && match[1]) {
                const memberType = match[1].toLowerCase();
                return `#class-${typeName}-${memberType}-${hyphenate(hovered)}`;
            }
        }
        return null;
    }
}
