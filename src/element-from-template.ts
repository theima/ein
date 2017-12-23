import { TemplateElement } from './template-element';
import { RenderedElement } from './rendered-element';
import { fromTemplate } from './from-template';

export function elementFromTemplate(e: TemplateElement): (model: any) => RenderedElement {
    if (tagRegistered(e.tag))
    let children: Array<(m: any) => RenderedElement | string> = e.children.map((c: TemplateElement | string) => {
        if (typeof c === 'string') {
            return fromTemplate(c);
        }
        return elementFromTemplate(c);
    });
    return (m: any) => {
        return {
            tag: e.tag,
            children: children.map(c => c(m))
        };
    };
}
