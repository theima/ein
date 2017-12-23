import {TemplateElement} from '../template-element';
import {RenderedElement} from '../rendered-element';
import {fromTemplate} from './from-template';

export function createElementFromTemplate(lookup: (tag: string) => (model: any) => RenderedElement): (e: TemplateElement) => (model: any) => RenderedElement {
  let elementFromTemplate = (e: TemplateElement) => {
    let custom = lookup(e.tag);
    if (custom) {
      return custom;
    }
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
  };
  return elementFromTemplate;
}
