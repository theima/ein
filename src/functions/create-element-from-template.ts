import {TemplateElement} from '../template-element';
import {RenderedElement} from '../rendered-element';
import {fromTemplate} from './from-template';
import {Dict} from '../types-and-interfaces/dict';

export function createElementFromTemplate(dict: Dict<TemplateElement>): (e: TemplateElement) => (model: any) => RenderedElement {
  let elementFromTemplate: (e: TemplateElement,  tags?: string[]) => (model: any) => RenderedElement = (e: TemplateElement, tags: string[] = []) => {
    if (tags.indexOf(e.tag) !== -1) {
      // throwing for now.
      throw new Error('Cannot use element inside itself');
    }
    let custom = dict[e.tag];
    if (custom) {
      e = custom;
    }
    let children: Array<(m: any) => RenderedElement | string> = e.children.map((c: TemplateElement | string) => {
      if (typeof c === 'string') {
        return fromTemplate(c);
      }
      return elementFromTemplate(c, [...tags, e.tag]);
    });
    return (m: any) => {
      let r: RenderedElement = {
        tag: e.tag,
        children: children.map(c => c(m))
      };
      if (e.eventsHandlers) {
        r.eventsHandlers = e.eventsHandlers;
      }
      return r;
    };
  };
  return elementFromTemplate;
}
