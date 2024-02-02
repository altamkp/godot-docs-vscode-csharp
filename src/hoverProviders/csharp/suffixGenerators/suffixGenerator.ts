export interface suffixGenerator {
    generate(typeName: string, hovered: string, lines: string[], lineNum: number): string | null;
}
