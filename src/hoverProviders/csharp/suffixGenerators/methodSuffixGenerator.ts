import { hyphenate } from "../../../utils/utils";
import { suffixGenerator as suffixGenerator } from "./suffixGenerator";

const regex = /public\s+(static )?\w+\s+\w+\(.*\)/;

export class MethodSuffixGenerator implements suffixGenerator {
    generate(typeName: string, hovered: string, lines: string[], lineNum: number): string | null {
        const line = lines[lineNum];
        return regex.test(line) 
            ? `#class-${typeName}-method-${hyphenate(hovered)}`
            : null;
    }
}
