import { hyphenate } from "../../../utils/utils";
import { suffixGenerator as suffixGenerator } from "./suffixGenerator";

const regex = /public.*delegate.*void.*\(.*\)/;

export class DelegateSuffixGenerator implements suffixGenerator {
    generate(typeName: string, hovered: string, lines: string[], lineNum: number): string | null {
        const line = lines[lineNum];
        return regex.test(line) 
            ? `#class-${typeName}-signal-${hyphenate(hovered.replace('EventHandler', ''))}`
            : null;
    }
}
