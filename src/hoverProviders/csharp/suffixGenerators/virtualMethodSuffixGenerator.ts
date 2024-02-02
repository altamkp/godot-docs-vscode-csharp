import { hyphenate } from "../../../utils/utils";
import { suffixGenerator as suffixGenerator } from "./suffixGenerator";

const regex = /public\s+virtual\s+\w+\s+\w+\(.*\)/;

export class VirtualMethodSuffixGenerator implements suffixGenerator {
    generate(typeName: string, hovered: string, lines: string[], lineNum: number): string | null {
        const line = lines[lineNum];
        let methodName = hyphenate(hovered.replace(/^_/, ''));
        return regex.test(line) 
            ? `#class-${typeName}-private-method-${methodName}`
            : null;
    }
}
