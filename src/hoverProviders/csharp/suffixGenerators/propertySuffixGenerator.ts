import { hyphenate } from "../../../utils/utils";
import { suffixGenerator as suffixGenerator } from "./suffixGenerator";

const regex = /public\s+\w+\s+\w+\r/;

export class PropertySuffixGenerator implements suffixGenerator {
    generate(typeName: string, hovered: string, lines: string[], lineNum: number): string | null {
        const line = lines[lineNum];
        return regex.test(line) 
            ? `#class-${typeName}-property-${hyphenate(hovered)}`
            : null;
    }
}
