import {TemplateString} from '../types-and-interfaces/template-string';

export function fromTemplate(templateString: TemplateString): (model: any) => string {
    let matcher: RegExp = /{{(\s*[\w\.]+\s*)}}/;
    let matches: Array<string | string[]> = [];
    let match = matcher.exec(templateString);
    while (match) {
        if (match.index > 0) {
            matches.push(templateString.substring(0, match.index));
        }
        matches.push(match[1].split('.'));
        templateString = templateString.substring(match.index + match[0].length);
        match = matcher.exec(templateString);
    }
    matches.push(templateString);
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
