export function fromTemplate(template: string): (model: any) => string {
    let matcher: RegExp = /{{(\s*[\w\.]+\s*)}}/;
    let matches: Array<string | string[]> = [];
    let match = matcher.exec(template);
    while (match) {
        if (match.index > 0) {
            matches.push(template.substring(0, match.index));
        }
        matches.push(match[1].split('.'));
        template = template.substring(match.index + match[0].length);
        match = matcher.exec(template);
    }
    matches.push(template);
    return (m: any) => {
        return matches.reduce((s: string, i: string | string[]) => {
            if (typeof i !== 'string') {
                let v: any = i.reduce((o: any, k: string) => {
                    return o[k];
                }, m);
                i = v + '';
            }
            return s + i;
        }, '');
    };
}
