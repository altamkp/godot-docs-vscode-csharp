export function fixClassName(typeName: string): string {
    if (typeName === 'GodotObject') {
        typeName = 'Object';
    }
    return typeName.toLowerCase();
}

export function hyphenate(str: string): string {
    return str.replace(/[A-Z]/g, (match, index) => (index === 0 ? '' : '-') + match.toLowerCase());
}
